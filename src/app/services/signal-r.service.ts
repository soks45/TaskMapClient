import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnectionState, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NGXLogger } from 'ngx-logger';

export interface ModifiedHub {
  connectionState$: Observable<HubConnectionState>;
  readonly hubConnection: signalR.HubConnection;
  startConnection(): void;
  stopConnection(): void;
}

class Hub implements ModifiedHub {
  public connectionState$: Observable<HubConnectionState>;
  readonly hubConnection: signalR.HubConnection;

  private connectionStateSource$: BehaviorSubject<HubConnectionState>;
  private newConnectionStateCallback = () => this.connectionStateSource$.next(this.hubConnection.state);


  constructor(private url: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Error)
      .build();

    this.connectionStateSource$ = new BehaviorSubject<HubConnectionState>(this.hubConnection.state);
    this.connectionState$ = this.connectionStateSource$.asObservable();
    this.connectionStateChangesOnEvents();
  }

  public startConnection(): void {
    this.hubConnection.start()
      .then(this.newConnectionStateCallback)
  }

  public stopConnection(): void {
    this.hubConnection.stop()
      .then(this.newConnectionStateCallback)
  }

  private connectionStateChangesOnEvents(): void {
    this.hubConnection.onreconnected(this.newConnectionStateCallback);
    this.hubConnection.onclose(this.newConnectionStateCallback);
    this.hubConnection.onreconnecting(this.newConnectionStateCallback);
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
    this.taskHub = new Hub(environment.signalRHubs.Tasks);
    this.taskHub.connectionState$.subscribe(state => this.logger.log(`[SignalRService]: new connection state: ${state}`));
  }
}
