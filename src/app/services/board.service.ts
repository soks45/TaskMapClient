import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Board } from 'src/models/board';
import { environment } from 'src/environments/environment';
import { TaskService } from 'src/app/services/task.service';
import { TaskB } from 'src/models/task-b';


@Injectable({
  providedIn: 'root'
})

export class BoardService {

  private _currentBoardId$: BehaviorSubject<number>;
  private _userBoards$: BehaviorSubject<Board[]>;
  private _TaskList$: BehaviorSubject<TaskB[]>;

  events: Subject<MouseEvent>;

  constructor(
    private http: HttpClient,
    private taskService: TaskService
  ) {
    this._currentBoardId$ = new BehaviorSubject<number>(1);
    this._userBoards$ = new BehaviorSubject<Board[]>([]);
    this.events = new Subject<MouseEvent>();
    this._currentBoardId$.subscribe((boardId: number) => {
      this.taskService.switchBoard(boardId);
    });
    this._TaskList$ = this.taskService.TaskList$;
  }

  get currentBoardId$(): Observable<number> {
    return this._currentBoardId$.asObservable();
  }

  get userBoards$(): Observable<Board[]> {
    return this._userBoards$.asObservable();
  }

  get taskList$(): Observable<TaskB[]> {
    return this._TaskList$.asObservable();
  }

  getBoard(): void {
    this.http.get<Board[]>(`${environment.apiUrl}/Board/get-boards`, { withCredentials: true }).subscribe({
      next: (value) => this._userBoards$.next(value),
      error: (err) => console.error(err),
    })
  }

  deleteBoard(boardId: number): void {
    const options = {
      params: {
        boardId
      },
      withCredentials: true
    }

    this.http.get<any>(`${environment.apiUrl}/Board/delete-board`, options).subscribe({
      next: () => {
        const index = this._userBoards$.value.findIndex(board => board.boardId === boardId);
        this._userBoards$.next(this._userBoards$.value.splice(index, 1));
      },
      error: (e) => {
        console.log(e)
      }
    });
  }

  addBoard(board: Board): void {
    const newBoard = JSON.stringify(board);
    const options = {
      params: {
        newBoard
      },
      withCredentials: true
    };
    this.http.post<Board>(`${environment.apiUrl}/Board/add-board`, options).subscribe({
      next: () => {
        let boards = this._userBoards$.value;
        boards.push(board);
        this._userBoards$.next(boards);
      },
      error: (e) => console.error(e)
    });
  }

  editBoard(board: Board): void {
    const newBoard = JSON.stringify(board);
    const options = {
      params: {
        newBoard
      },
      withCredentials: true
    };
    this.http.post<Board>(`${environment.apiUrl}/Board/add-board`, options).subscribe({
      next: () => {
        let boards = this._userBoards$.value;
        boards[boards.findIndex(b => b.boardId === board.boardId)] = board;
        this._userBoards$.next(boards);
      },
      error: (e) => console.error(e)
    });
  }
}
