import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth';
import { BoardService } from 'src/app/services/board.service';
import { SignalRService } from './services/signal-r.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private signalR: SignalRService) {}
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.signalR.taskHub.startConnection();
        return;
      }
      this.signalR.taskHub.stopConnection();
    });
  }
}
