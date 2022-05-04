import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnectionState, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export class Hub {
  private _connectionState$ = new BehaviorSubject<HubConnectionState>(HubConnectionState.Disconnected);
  private readonly _hubConnection: signalR.HubConnection;

  constructor(
    private _url: string,
  ) {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(_url)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Trace)
      .build();
    this._hubConnection.onreconnected(() => {
      console.log('Reconnected')
      this._connectionState$.next(this._hubConnection.state);
    });
    this._hubConnection.onclose(() => {
      console.log('Closed')
      this._connectionState$.next(this._hubConnection.state);
    });
    this._hubConnection.onreconnecting(() => {
      console.log('Reconnecting')
      this._connectionState$.next(this._hubConnection.state);
    });
  }

  public startConnection(): Promise<void> {
    return this._hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        this._connectionState$.next(this._hubConnection.state);
      })
      .catch(err => {
        console.log('Error while starting connection: ' + err);
        this._connectionState$.next(this._hubConnection.state);
      });
  }

  public stopConnection(): void {
    this._hubConnection
      .stop()
      .then(() => {
        console.log('Connection stopped');
        this._connectionState$.next(this._hubConnection.state);
      })
      .catch((err) => {
        console.log('Error while stopping connection: ' + err);
        this._connectionState$.next(this._hubConnection.state);
      })
  }

  public get HubConnection(): signalR.HubConnection {
    return this._hubConnection;
  }

  public get Url(): string {
    return this._url;
  }

  public get ConnectionState$(): Observable<HubConnectionState> {
    return this._connectionState$.asObservable();
  }
}

@Injectable({
  providedIn: 'root'
})

export class SignalRService {
  private readonly _hubs: Hub[];

  constructor() {
    this._hubs = [];
    this.createHubs();
  }

  private createHubs(): void {
    this._hubs.push(this.createHub(environment.signalRHubs.Tasks))
  }

  private createHub(url: string): Hub {
    const hub = new Hub(url);
    return hub;
  }

  public get hubs(): Hub[] {
    return this._hubs;
  }
}
