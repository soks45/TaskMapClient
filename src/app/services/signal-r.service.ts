import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { LogLevel } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

export class Hub {
  private _isConnected$ = new BehaviorSubject(false);
  private readonly _hubConnection: signalR.HubConnection;

  constructor(
    private _url: string,
  ) {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(_url)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Trace)
      .build();
  }

  public startConnection(): void {
    this._hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        this._isConnected$.next(true);
      })
      .catch(err => {
        console.log('Error while starting connection: ' + err);
        this._isConnected$.next(false);
      });
  }

  public stopConnection(): void {
    this._hubConnection
      .stop()
      .then(() => {
        console.log('Connection stopped');
        this._isConnected$.next(false);
      })
      .catch((err) => {
          console.log('Error while stopping connection: ' + err);
          this._isConnected$.next(false);
      })
  }

  public get hubConnection(): signalR.HubConnection {
    return this._hubConnection;
  }

  public get url(): string {
    return this._url;
  }

  public get isConnected(): BehaviorSubject<boolean> {
    return this._isConnected$;
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
