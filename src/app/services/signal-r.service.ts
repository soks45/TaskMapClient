import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnectionState, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NGXLogger } from 'ngx-logger';

export class Hub {
  private _connectionState$ = new BehaviorSubject<HubConnectionState>(HubConnectionState.Disconnected);
  private readonly _hubConnection: signalR.HubConnection;

  constructor(
    private _url: string,
    private logger: NGXLogger
  ) {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(_url)
      .withAutomaticReconnect()
      .configureLogging(logger)
      .build();
    this._hubConnection.onreconnected(() => {
      logger.log('Reconnected')
      this._connectionState$.next(this._hubConnection.state);
    });
    this._hubConnection.onclose(() => {
      logger.warn('Closed');
      this._connectionState$.next(this._hubConnection.state);
    });
    this._hubConnection.onreconnecting(() => {
      logger.warn('Reconnecting');
      this._connectionState$.next(this._hubConnection.state);
    });
  }

  public startConnection(): void {
    this._hubConnection
      .start()
      .then(() => {
        this.logger.log('Connection started');
        this._connectionState$.next(this._hubConnection.state);
      })
      .catch(err => {
        this.logger.error('Error while starting connection: ' + err);
        this._connectionState$.next(this._hubConnection.state);
      });
  }

  public stopConnection(): void {
    this._hubConnection
      .stop()
      .then(() => {
        this.logger.log('Connection stopped');
        this._connectionState$.next(this._hubConnection.state);
      })
      .catch((err) => {
        this.logger.error('Error while stopping connection: ' + err);
        this._connectionState$.next(this._hubConnection.state);
      })
  }

  public get HubConnection(): signalR.HubConnection {
    return this._hubConnection;
  }

  public get ConnectionState$(): Observable<HubConnectionState> {
    return this._connectionState$.asObservable();
  }
}

@Injectable({
  providedIn: 'root'
})

export class SignalRService {
  public taskHub: Hub;
  constructor(
    private logger: NGXLogger
  ) {
    this.taskHub = new Hub(environment.signalRHubs.Tasks, this.logger);
  }
}
