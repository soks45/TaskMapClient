import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskB } from 'src/models/task-b';
import { Subject, Subscription } from "rxjs";
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  boardId!: number
  taskList: TaskB[];
  events: Subject<MouseEvent>;
  event?: MouseEvent;
  subscription?: Subscription;

  constructor(
    private boardService: BoardService
  ) {
    this.boardService.CurrentBoardId$.subscribe(id => {
      this.boardId = id;
      console.log('currentboard -', this.boardId);
    });
    this.taskList = [];
    this.events = new Subject<MouseEvent>();
  }

  ngOnInit(): void {
    // this.taskService.switchBoard(this.boardId);
    // this.subscription = this.boardService.taskList$.subscribe(res => {
    //   console.log('some changes', res);
    //   this.taskList = res;
    // });
  }
  //
  // onRightClick(event: MouseEvent) {
  //   event.preventDefault();
  //   this.boardService.events.next(event)
  //   console.log(event);
  // }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
