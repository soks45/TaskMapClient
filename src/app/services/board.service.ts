import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cached, ClearCache } from 'src/app/decorators/requests';
import { TaskService } from 'src/app/services/task-service';
import { environment } from 'src/environments/environment';
import { Board } from 'src/models/board';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  boards$: Observable<Board[]>;
  currentBoard$: Observable<Board>;

  private currentBoardSource$: Subject<Board>;
  private boardsSource$: BehaviorSubject<Board[]>;

  constructor(
    private http: HttpClient,
    private taskService: TaskService
  ) {
    this.currentBoardSource$ = new Subject<Board>();
    this.currentBoard$ = this.currentBoardSource$;

    this.boardsSource$ = new BehaviorSubject<Board[]>([]);
    this.boards$ = this.boardsSource$.asObservable();
  }


  @Cached() @ClearCache('getBoards')
  public switchBoard(board: Board): Observable<Board> {
    return this.taskService.loadTasks(board)
      .pipe(
        map(() => board),
        tap(board => this.switchBoardClient(board)));
  }

  @Cached()
  public getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${environment.apiUrl}/board/get-boards`)
      .pipe(tap(boards => this.getBoardsClient(boards)));
  }

  @Cached()
  public addBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(`${environment.apiUrl}/board/add-board`, board,{ withCredentials: true })
      .pipe(tap(board => this.addBoardClient(board)));
  }

  @Cached()
  public editBoard(board: Board): Observable<Board> {
    return this.http.put<Board>(`${environment.apiUrl}/board/change-board/${board.boardId}`, board, { withCredentials: true })
      .pipe(tap(board => this.editBoardClient(board)));
  }

  @Cached()
  public deleteBoard(board: Board): Observable<number> {
    return this.http.delete<number>(`${environment.apiUrl}/board/delete-board/${board.boardId}`,  { withCredentials: true })
      .pipe(tap(id => this.deleteBoardClient(id)));
  }

  private getBoardsClient(boards: Board[]): void {
    this.boardsSource$.next(boards);
  }

  private addBoardClient(board: Board): void {
    const currentBoards = this.boardsSource$.getValue();
    currentBoards.push(board);
    this.boardsSource$.next(currentBoards);
  }

  private editBoardClient(board: Board): void {
    let needReload = false;
    const boards = this.boardsSource$.getValue()
      .map(item => {
        if (item.boardId === board.boardId) {
          needReload = true;
          item = board;
        }
        return item;
      });
    if (needReload)
      this.boardsSource$.next(boards);
  }

  private deleteBoardClient(id: number): void {
    const currentBoards = this.boardsSource$.getValue();
    const boards = currentBoards.filter(item => item.boardId !== id);
    if (currentBoards.length !== boards.length) {
      this.boardsSource$.next(boards);
    }
  }

  private switchBoardClient(board: Board): void {
    this.currentBoardSource$.next(board);
  }
}
