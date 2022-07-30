import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/core';
import { SignalRService } from 'src/app/services/signal-r.service';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable, Subject } from 'rxjs';
import { Board } from '../../models/board';

@Injectable({
  providedIn: 'root'
})
export class BoardService /*implements OnDestroy*/ {
  currentBoard$: Observable<Board>;
  private currentBoardSource$: Subject<Board>;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private signalRService: SignalRService,
    private router: Router,
    private logger: NGXLogger
  ) {
    this.currentBoardSource$ = new Subject<Board>();
    this.currentBoard$ = this.currentBoardSource$.asObservable();
    this.currentBoard$.subscribe(res => console.log(res));
    setTimeout(() => this.currentBoardSource$.next({
      boardId: 3,
      createdDate: '31',
      userId: 3,
      boardDescription: 'dwa',
      boardName: 'daw'
    }), 100);

  }


  // private switchBoard(boardId: number): Promise<any> {
  //   return this.taskHub.hubConnection.invoke('JoinBoard', boardId)
  //     .then(() => {
  //       this.logger.trace('-switchboard-: ', boardId);
  //     })
  //     .catch((e) => this.logger.error(e));
  // }
  //
  // public deleteBoard(board: Board): void {
  //   if (this.UserBoards.length < 2) {
  //     this.logger.warn('The last board can not be deleted!');
  //     return
  //   }
  //   this.deleteBoardById(board.boardId);
  //   if (this._currentBoardId === board.boardId) {
  //     this.switchBoard(this.UserBoards[0].boardId)
  //   }
  // }
  //
  // private getBoard(): Observable<Board[]> {
  //   return this.http.get<Board[]>(`${environment.apiUrl}/Board/get-boards`, { withCredentials: true });
  // }
  //
  // private deleteBoardById(boardId: number): void {
  //   const options = {
  //     params: {
  //       boardId
  //     },
  //   }
  //   this.http.get<void>(`${environment.apiUrl}/Board/delete-board`, options).subscribe({
  //     next: () => {
  //       const index = this._userBoards$.value.findIndex(board => board.boardId === boardId);
  //       const newList = this._userBoards$.value
  //       newList.splice(index, 1);
  //       this._userBoards$.next(newList);
  //     },
  //     error: (e) => this.logger.error(e)
  //   });
  // }
  //
  // addBoard(board: Board): void {
  //   const options = {
  //     boardId: board.boardId,
  //     userId: board.userId,
  //     boardName: board.boardName,
  //     createdDate: board.createdDate,
  //     boardDescription: board.boardDescription,
  //     withCredentials: true
  //   };
  //   this.http.post<number>(`${environment.apiUrl}/Board/add-board`, options).subscribe({
  //     next: (boardId) => {
  //       board.boardId = boardId;
  //       let boards = this._userBoards$.value;
  //       boards.push(board);
  //       this._userBoards$.next(boards);
  //     },
  //     error: (e) => this.logger.error(e)
  //   });
  // }
  //
  // editBoard(board: Board): void {
  //   const options = {
  //     boardId: board.boardId,
  //     userId: board.userId,
  //     boardName: board.boardName,
  //     createdDate: board.createdDate,
  //     boardDescription: board.boardDescription,
  //     withCredentials: true
  //   };
  //   this.http.post<void>(`${environment.apiUrl}/Board/change-board`, options).subscribe({
  //     next: () => {
  //       let boards = this._userBoards$.value;
  //       boards[boards.findIndex(b => b.boardId === board.boardId)] = board;
  //       this._userBoards$.next(boards);
  //     },
  //     error: (e) => this.logger.error(e)
  //   });
  // }
}
