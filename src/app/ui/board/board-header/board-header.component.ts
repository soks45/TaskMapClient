import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
import { Board } from 'src/models/board';
import { AuthService } from 'src/app/core';
import { filter, Subscription } from 'rxjs';
import { User } from 'src/models/user';

@Component({
  selector: 'app-board-header',
  templateUrl: './board-header.component.html',
  styleUrls: ['./board-header.component.scss']
})
export class BoardHeaderComponent implements OnInit, OnDestroy {

  user!: User;
  private readonly subs: Subscription[] = [];

  constructor(
    private boardService: BoardService,
    private auth: AuthService
  ) {
    this.subs.push(this.auth.user$.pipe(filter(user => user !== null)).subscribe((val) => {
      // @ts-ignore
      this.user = val;
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
  }

  newBoard() {
    const board: Board = {
      boardId: 0,
      userId: this.user.userId,
      state: 'vsemq',
      boardName: 'dada',
      createdDate: '',
      boardDescription: 'dada',
    }
    this.boardService.addBoard(board);
  }

  nextBoard() {

  }

  previousBoard() {

  }

  deleteBoard() {
    this.boardService.deleteBoard(7);
  }
}
