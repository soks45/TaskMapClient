import { Component,  Input, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { TaskB } from 'src/models/task-b';
import { TaskCreateDialogComponent } from "src/app/ui/board/task-create-dialog/task-create-dialog.component";
import { Subject } from "rxjs";

@Component({
  selector: 'app-dnd-field',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input() boardId: number = 0;
  taskList: TaskB[];
  events: Subject<MouseEvent>;
  event?: MouseEvent;

  constructor(
    private taskService: TaskService,

  ) {
    this.taskList = [];
    this.events = new Subject<MouseEvent>();
  }

  ngOnInit(): void {
    this.taskService.switchBoard(this.boardId);
    this.taskService.TaskList$.subscribe(res => {
      console.log('some changes', res);
      this.taskList = res;
    });
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.events.next(event);
    console.log(event);
  }
}
