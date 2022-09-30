import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import * as signalR from '@microsoft/signalr';
import { HubConnectionState, IRetryPolicy, LogLevel, RetryContext } from '@microsoft/signalr';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, distinct, from, Observable, switchMap, tap } from 'rxjs';

interface ModifiedHub {
    readonly connectionState$: Observable<HubConnectionState>;

    startConnection(): Observable<void>;

    stopConnection(): Observable<void>;

    on(methodName: string, args: any): void;
}

@Injectable({
    providedIn: 'root',
})
export class TaskHubService implements ModifiedHub {
    public readonly connectionState$: Observable<HubConnectionState>;

    private readonly hubConnection: signalR.HubConnection;
    private readonly connectionStateSource$: BehaviorSubject<HubConnectionState>;
    private newConnectionStateCallback = () => this.connectionStateSource$.next(this.hubConnection.state);

    constructor(private logger: NGXLogger) {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(environment.signalRHubs.Tasks)
            .withAutomaticReconnect(this.retryPolicyFactory())
            .configureLogging(LogLevel.Error)
            .build();

        this.connectionStateSource$ = new BehaviorSubject<HubConnectionState>(this.hubConnection.state);
        this.connectionState$ = this.connectionStateSource$.pipe(distinct());
        this.connectionState$.subscribe((state) => this.logger.log(`[SignalRService]: new connection state: ${state}`));
        this.connectionStateChangesOnEvents();
    }

    public safeInvoke<T>(methodName: string, arg: any): Observable<T> {
        return this.hubConnection.state === HubConnectionState.Connected
            ? from(this.hubConnection.invoke<T>(methodName, arg))
            : this.startConnection().pipe(switchMap(() => from(this.hubConnection.invoke<T>(methodName, arg))));
    }

    public startConnection(): Observable<void> {
        return from(this.hubConnection.start().then(() => console.log('new start conn'))).pipe(
            tap(this.newConnectionStateCallback)
        );
    }

    public stopConnection(): Observable<void> {
        return from(this.hubConnection.stop()).pipe(tap(this.newConnectionStateCallback));
    }

    on(methodName: string, args: any): void {
        this.hubConnection.on(methodName, args);
    }

    private connectionStateChangesOnEvents(): void {
        this.hubConnection.onreconnected(this.newConnectionStateCallback);
        this.hubConnection.onclose(this.newConnectionStateCallback);
        this.hubConnection.onreconnecting(this.newConnectionStateCallback);
    }

    private retryPolicyFactory(): IRetryPolicy {
        return {
            nextRetryDelayInMilliseconds(retryContext: RetryContext): number | null {
                if (retryContext.previousRetryCount > 10) {
                    return null;
                }
                return (retryContext.previousRetryCount + 1) * 1000;
            },
        };
    }
}
