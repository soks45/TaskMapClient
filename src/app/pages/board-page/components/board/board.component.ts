import { Component, Input } from '@angular/core';
import { TaskService } from 'src/app/services/task-service';
import { Board } from 'src/models/board';
import { TaskB } from 'src/models/task-b';

@Component({
  selector: 'tm-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() board: Board | null = null;
  tasks: TaskB[]

  constructor(private taskService: TaskService) {
    this.tasks = this.taskService.tasks;
  }
}
