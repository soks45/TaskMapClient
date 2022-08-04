import { Component, OnDestroy } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
import { Board } from 'src/models/board';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  BoardCreateDialogComponent
} from 'src/app/ui/header/header-menu/board-create-dialog/board-create-dialog.component';
import { TaskB } from 'src/models/task-b';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'tm-boards-multiselect-menu-button',
  templateUrl: './boards-multiselect-menu-button.component.html',
  styleUrls: ['./boards-multiselect-menu-button.component.scss']
})
export class BoardsMultiselectMenuButtonComponent /*implements OnDestroy*/ {
  /*boards: Board[] = [];

  private currentRoute: string = '';
  private subs: Subscription[] = [];

  constructor(
    private boardsService: BoardService,
    private dialog: MatDialog,
    private logger: NGXLogger
  ) {
    this.subs.push(this.boardsService.CurrentRoute$.subscribe(evt => {
      this.currentRoute = evt.url
    }));
    this.subs.push(this.boardsService.UserBoards$.subscribe(boards => {
      this.boards = boards;
    }));
    this.boards = this.boardsService.UserBoards;
  }

  get isBoardPage(): boolean {
    return this.currentRoute === '/board-page';
  }

  onItemSelect(board: Board) {
    this.boardsService.loadBoardTasks(board.boardId);
  }

  ngOnDestroy() {
    this.subs.forEach(val => val.unsubscribe());
  }

  showCurrentBoards() {
    console.log(this.boards);
  }

  deleteBoard(board: Board) {
    this.boardsService.deleteBoard(board);
  }

  newBoard() {
    const dr = this.dialog.open(BoardCreateDialogComponent, {
      panelClass: 'std-dialog-panel',
      backdropClass: 'std-dialog-backdrop231',
      disableClose: true,
      closeOnNavigation: true,
      data: {}
    });
    dr.afterClosed().subscribe(res => this.logger.trace(res));
  }*/
}
