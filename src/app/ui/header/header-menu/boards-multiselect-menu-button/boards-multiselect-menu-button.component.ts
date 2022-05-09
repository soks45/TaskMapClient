import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
import { Board } from 'src/models/board';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-boards-multiselect-menu-button',
  templateUrl: './boards-multiselect-menu-button.component.html',
  styleUrls: ['./boards-multiselect-menu-button.component.scss']
})
export class BoardsMultiselectMenuButtonComponent implements OnDestroy {
  boards: Board[] = [];

  private currentRoute: string = '';
  private subs: Subscription[] = [];

  constructor(
    private boardsService: BoardService,
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
}
