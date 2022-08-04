import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth';
import { BoardService } from 'src/app/services/board.service';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'tm-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  constructor(private taskService: TaskService, private boardService: BoardService, private auth: AuthService) {
  }
}
