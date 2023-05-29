import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import * as signalR from '@microsoft/signalr';
import { IRetryPolicy, LogLevel, RetryContext } from '@microsoft/signalr';
import { from, Observable } from 'rxjs';

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
export class NotificationService {
    private readonly hubConnection: signalR.HubConnection;

    constructor() {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(environment.signalRHubs.notifications)
            .withAutomaticReconnect(retryPolicyFactory())
            .configureLogging(LogLevel.Error)
            .build();
    }

    public startConnection(): Observable<void> {
        return from(this.hubConnection.start());
    }

    public stopConnection(): Observable<void> {
        return from(this.hubConnection.stop());
    }
}
