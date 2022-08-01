import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { Cached, ConvertData, LoadData } from 'src/app/decorators/requests';
import { TaskService } from 'src/app/services/task-service';
import { environment } from 'src/environments/environment';
import { Board } from 'src/models/board';
import ClearCache = Cached.ClearCache;
import CachedIn = Cached.CachedIn;

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  boards$: Observable<Board[]>;
  currentBoard$: Observable<Board>;

  private currentBoardSource$: Subject<Board>;
  private boardsSource$: BehaviorSubject<Board[]>;
  private boardsCache$?: Observable<Board[]>;

  constructor(
    private http: HttpClient,
    private taskService: TaskService
  ) {
    this.currentBoardSource$ = new Subject<Board>();
    this.currentBoard$ = this.currentBoardSource$
      .pipe(tap(board => this.taskService.loadTasks(board).subscribe()));

    this.boardsSource$ = new BehaviorSubject<Board[]>([]);
    this.boards$ = this.boardsSource$.asObservable();
  }

  @ClearCache('boardsCache$')
  @LoadData('switchBoardClient')
  public switchBoard(board: Board): Observable<Board> {
    return this.taskService.loadTasks(board)
      .pipe(map(() => board));
  }

  @CachedIn('boardsCache$')
  @LoadData('getBoardsClient')
  public getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${environment.apiUrl}/board/get-boards`);
  }

  @LoadData('addBoardClient')
  public addBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(`${environment.apiUrl}/board/add-board`, board,{ withCredentials: true });
  }

  @LoadData('editBoardClient')
  public editBoard(board: Board): Observable<Board> {
    return this.http.put<Board>(`${environment.apiUrl}/board/change-board/${board.boardId}`, board, { withCredentials: true });
  }

  @LoadData('deleteBoardClient')
  public deleteBoard(board: Board): Observable<number> {
    return this.http.delete<number>(`${environment.apiUrl}/board/delete-board/${board.boardId}`,  { withCredentials: true });
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
