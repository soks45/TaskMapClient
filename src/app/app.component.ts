import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core';
import { BoardService } from 'src/app/services/board.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private boardService: BoardService) {}

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
  }
}
