import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnectionState, LogLevel } from '@microsoft/signalr';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, from, Observable, switchMap, tap } from 'rxjs';
import { Cached } from 'src/app/decorators/requests';
import { environment } from 'src/environments/environment';

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

  @Cached()
  public startConnection(): Observable<void> {
    return from(this.hubConnection.start())
      .pipe(tap(this.newConnectionStateCallback));
  }

  @Cached()
  public stopConnection(): Observable<void> {
    return from(this.hubConnection.stop())
      .pipe(tap(this.newConnectionStateCallback));
  }

  public smartInvoke<T>(methodName: string, arg: any): Observable<T> {
    return this.hubConnection.state === HubConnectionState.Connected ?
      from(this.hubConnection.invoke<T>(methodName, arg)) :
      this.startConnection().pipe(switchMap(() => from(this.hubConnection.invoke<T>(methodName, arg))));
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
