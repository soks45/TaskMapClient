import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core';
import { SignalRService } from './services/signal-r.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private signalR: SignalRService) {}

  ngOnInit(): void {
    this.signalR.taskHub.startConnection();
  }
}
