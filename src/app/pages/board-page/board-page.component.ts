import { Component, OnInit } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { BoardService } from 'src/app/services/board.service';
import { Board } from 'src/models/board';

@Component({
  selector: 'tm-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.scss']
})
export class BoardPageComponent implements OnInit {
  currentBoard$: Observable<Board>;

  constructor(private boardService: BoardService) {
    this.currentBoard$ = this.boardService.getBoards()
      .pipe(switchMap((value) => this.boardService.switchBoard(value[0])));
  }

  ngOnInit(): void {
    console.log('init')

  }
}
