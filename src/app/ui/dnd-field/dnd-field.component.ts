import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { TaskB } from 'src/models/task-b';

@Component({
  selector: 'app-dnd-field',
  templateUrl: './dnd-field.component.html',
  styleUrls: ['./dnd-field.component.scss']
})
export class DndFieldComponent implements OnInit {
  @ViewChild('x') x?: ElementRef;
  @ViewChild('y') y?: ElementRef;
  @ViewChild('taskId') taskId?: ElementRef;
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

  addNewTask(): void {
    if(this.x && this.y && this.taskId) {
      const task: TaskB = {
        userId: 1,
        taskId: parseInt(this.taskId.nativeElement.value),
        coordinates: {
          x: parseInt(this.x.nativeElement.value),
          y: parseInt(this.y.nativeElement.value)
        },
        taskLabel: '',
        taskText: '',
        state: 0,
        boardId: this.boardId,
        color: '',
        createdDate: '123',
      }
      console.log(task);
      this.taskService.addNewTask(task);
    }

  }
}
