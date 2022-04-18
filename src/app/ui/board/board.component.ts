import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { TaskB } from 'src/models/task-b';
import { Subject } from "rxjs";
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'app-dnd-field',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  boardId!: number
  taskList: TaskB[];
  events: Subject<MouseEvent>;
  event?: MouseEvent;

  constructor(
    private taskService: TaskService,
    private boardService: BoardService

  ) {
    this.boardService.currentBoardId$.subscribe(id => {
      this.boardId = id;
      console.log('currentboard -', this.boardId);
    });
    this.taskList = [];
    this.events = new Subject<MouseEvent>();
  }

  ngOnInit(): void {
    this.taskService.switchBoard(this.boardId);
    this.boardService.taskList$.subscribe(res => {
      console.log('some changes', res);
      this.taskList = res;
    });
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.boardService.events.next(event)
    console.log(event);
  }
}
