import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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
    this.boardService.switchBoard(2).subscribe();
    this.currentBoard$ = this.boardService.currentBoard$;
  }

  ngOnInit(): void {
  }
}
