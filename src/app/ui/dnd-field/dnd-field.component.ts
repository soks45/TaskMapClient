import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { TaskB } from 'src/models/task-b';

@Component({
  selector: 'app-dnd-field',
  templateUrl: './dnd-field.component.html',
  styleUrls: ['./dnd-field.component.scss']
})
export class DndFieldComponent implements OnInit {
  @Input() boardId: number = 0;
  taskList: TaskB[];
  constructor(private taskService: TaskService) {
    this.taskList = [];
  }

  ngOnInit(): void {
    this.taskService.switchBoard(this.boardId);
    this.taskService.TaskList$.subscribe(res => {
      this.taskList = res;
    })
  }
}
