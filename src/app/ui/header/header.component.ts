import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BoardService } from 'src/app/services/board.service';
import { Board } from 'src/models/board';

@Component({
  selector: 'task-map-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent /*implements OnDestroy*/ {
  /*private readonly ngUnsubscribe$: Subject<void> = new Subject<void>();
  private boards:  Board[] = [];
  private id:  number | undefined = undefined;
  private route: string = '';

  constructor(private boardService: BoardService) {
    this.boardService.UserBoards$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(boards => this.boards = boards);
    this.boardService.CurrentBoardId$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(id => this.id = id);
    this.boardService.CurrentRoute$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(evt => this.route = evt.url);
  }

  get headerLabel(): string {
    // console.log(this.route, this.id, this.boards.find(board => board.boardId === this.id));
    const board = this.boards.find(board => board.boardId === this.id);
    if (this.route === '/main-page' || this.id === undefined || !board) {
       return 'TaskMap';
    }
    return board.boardName;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.unsubscribe();
  }*/

}
