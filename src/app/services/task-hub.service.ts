import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { IRetryPolicy } from '@microsoft/signalr/src/IRetryPolicy';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, from, Observable, retryWhen, switchMap, take, tap } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Cached } from 'src/app/decorators/cached';
import { environment } from 'src/environments/environment';

interface ModifiedHub {
  readonly hubConnection: HubConnection;
  readonly connectionState$: Observable<HubConnectionState>;
  readonly state: HubConnectionState;
  startConnection(): void;
  stopConnection(): void;
}

@Injectable({
  providedIn: 'root'
})
export class TaskHubService implements ModifiedHub {
  public readonly hubConnection: signalR.HubConnection;
  public readonly connectionState$: Observable<HubConnectionState>;
  public readonly state: HubConnectionState;

  private readonly connectionStateSource$: BehaviorSubject<HubConnectionState>;
  private readonly hubUrl: string = environment.signalRHubs.Tasks;

  private newConnectionStateCallback = () => this.connectionStateSource$.next(this.hubConnection.state);

  constructor(private logger: NGXLogger) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect() // TODO implement retry policy
      .configureLogging(LogLevel.Error)
      .build();

    this.state = this.hubConnection.state;

    this.connectionStateSource$ = new BehaviorSubject<HubConnectionState>(this.hubConnection.state);
    this.connectionState$ = this.connectionStateSource$.asObservable();
    this.connectionState$.subscribe(state => this.logger.log(`[SignalRService]: new connection state: ${state}`));
    this.connectionStateChangesOnEvents();
  }

  @Cached()
  public startConnection(): Observable<void> {
    return from(this.hubConnection.start())
      .pipe( // TODO remove this retry after implementing retry policy
        retryWhen(errors => errors
          .pipe(
            tap((errorValue) => this.logger.error(`[SignalRService]: reconnecting...`)),
            delay(6000),
            take(5))),
        tap(this.newConnectionStateCallback));
  }

  @Cached()
  public stopConnection(): Observable<void> {
    return from(this.hubConnection.stop())
      .pipe(tap(this.newConnectionStateCallback));
  }

  public safeInvoke<T>(methodName: string, arg: any): Observable<T> {
    return this.hubConnection.state === HubConnectionState.Connected ?
      from(this.hubConnection.invoke<T>(methodName, arg)) :
      this.startConnection().pipe(switchMap(() => from(this.hubConnection.invoke<T>(methodName, arg))))
  }

  private connectionStateChangesOnEvents(): void {
    this.hubConnection.onreconnected(this.newConnectionStateCallback);
    this.hubConnection.onclose(this.newConnectionStateCallback);
    this.hubConnection.onreconnecting(this.newConnectionStateCallback);
  }
}
