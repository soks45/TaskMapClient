import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  data$ = new BehaviorSubject('');
  private hubConnection?: signalR.HubConnection;
  // private data?: string;

  public startConnection = () => {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/hub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
      })
      .catch(err => console.log('Error while starting connection: ' + err));


    this.hubConnection.invoke('JoinGroup', 'test')
                  .catch(err => console.error(err))
  }

  public addTransferChartDataListener = () => {
    if (this.hubConnection) {
      this.hubConnection.on('newMessage', (data: string) => {
        this.data$.next(data);
        console.log(data);
      });
    }
  }

  public broadcastChartData = (data: string) => {
    if (this.hubConnection) {
      this.hubConnection.invoke('newMessage','test', data)
        .catch(err => console.error(err));
    }
  }











}
