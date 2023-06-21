import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import * as signalR from '@microsoft/signalr';
import { HubConnectionState, IRetryPolicy, LogLevel, RetryContext } from '@microsoft/signalr';
import { AuthService } from '@services/auth.service';
import { BehaviorSubject, filter, from, Observable, switchMap, take, tap } from 'rxjs';
import { map } from 'rxjs/operators';

function retryPolicyFactory(): IRetryPolicy {
    return {
        nextRetryDelayInMilliseconds(retryContext: RetryContext): number | null {
            if (retryContext.previousRetryCount > 10) {
                return null;
            }
            return (retryContext.previousRetryCount + 1) * 1000;
        },
    };
}

@Injectable({
    providedIn: 'root',
})
export class SignalRService {
    public hubConnection: signalR.HubConnection;
    private connectionState$: BehaviorSubject<HubConnectionState> = new BehaviorSubject<HubConnectionState>(
        HubConnectionState.Disconnected
    );

    constructor(private authService: AuthService) {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(environment.signalRHubs.notifications, {
                accessTokenFactory: () => {
                    return this.authService.accessToken!;
                },
            })
            .withAutomaticReconnect(retryPolicyFactory())
            .configureLogging(LogLevel.None)
            .build();

        this.authService.isAuthed$
            .pipe(switchMap((auth) => (auth ? this.startConnection() : this.stopConnection())))
            .subscribe();

        this.hubConnection.onclose(this.updateState.bind(this));
    }

    public startConnection(): Observable<void> {
        return from(this.hubConnection.start()).pipe(tap(this.updateState.bind(this)));
    }

    public stopConnection(): Observable<void> {
        return from(this.hubConnection.stop());
    }

    public joinBoard(boardId: number): Observable<number> {
        return this.safeInvoke(() => this.hubConnection.invoke('JoinBoard', boardId.toString())).pipe(
            map(() => boardId)
        );
    }

    public sendTaskListChangedEvent(boardId: number): Observable<void> {
        return this.safeInvoke(() => this.hubConnection.invoke(`BoardTaskListChangedNotification`, boardId));
    }

    public sendBoardChangedEvent(boardId: number): Observable<void> {
        return this.safeInvoke(() => this.hubConnection.invoke(`BoardChangedNotification`, boardId));
    }

    public sendShareBoardNotificationEvent(userIds: number[]): Observable<void> {
        return this.safeInvoke(() => this.hubConnection.invoke(`ShareBoardNotification`, userIds));
    }

    private safeInvoke(invoke: () => Promise<any>): Observable<void> {
        return this.connectionState$.pipe(
            filter((state) => state === HubConnectionState.Connected),
            tap(() => invoke()),
            map(() => void 0),
            take(1)
        );
    }

    private updateState(): void {
        this.connectionState$.next(this.hubConnection.state);
    }
}
