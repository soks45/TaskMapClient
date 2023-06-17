import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import * as signalR from '@microsoft/signalr';
import { IRetryPolicy, LogLevel, RetryContext } from '@microsoft/signalr';
import { AuthService } from '@services/auth.service';
import { from, Observable, switchMap } from 'rxjs';

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
    private readonly hubConnection: signalR.HubConnection;

    constructor(private authService: AuthService) {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(environment.signalRHubs.notifications, {
                accessTokenFactory: () => {
                    return this.authService.accessToken!;
                },
            })
            .withAutomaticReconnect(retryPolicyFactory())
            .configureLogging(LogLevel.Trace)
            .configureLogging(LogLevel.Error)
            .build();

        this.authService.isAuthed$
            .pipe(switchMap((auth) => (auth ? this.startConnection() : this.stopConnection())))
            .subscribe();
    }

    public startConnection(): Observable<void> {
        return from(this.hubConnection.start());
    }

    public stopConnection(): Observable<void> {
        return from(this.hubConnection.stop());
    }

    public joinBoard(boardId: number): void {
        this.hubConnection.invoke('JoinBoard', boardId.toString());
    }
}
