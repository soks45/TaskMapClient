import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  // public data?: ChartModel[];
  private hubConnection?: signalR.HubConnection

  public startConnection = () => {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/hub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public addTransferChartDataListener = () => {
    if (this.hubConnection) {
      this.hubConnection.on('NewMessage', (data: string) => {
        // this.data = data;
        console.log(data);
      });
    }
  }

  public broadcastChartData = () => {
    if (this.hubConnection) {
      this.hubConnection.invoke('NewMessage', 'Hello World!')
        .catch(err => console.error(err));
    }
  }











}
