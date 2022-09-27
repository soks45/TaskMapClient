import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Board } from '@models/board';
import { TaskB } from '@models/task-b';
import { TaskService } from '@services/task-service';
import { Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BoardService {
    readonly boards: Board[] = [];
    readonly currentBoard$: Observable<Board>;
    private readonly currentBoardSource$: ReplaySubject<Board>;
    lastBoardId?: number;

    constructor(private http: HttpClient, private taskService: TaskService) {
        this.currentBoardSource$ = new ReplaySubject<Board>(1);
        this.currentBoard$ = this.currentBoardSource$.asObservable();
    }

    public switchBoard(board: Board): Observable<TaskB[]> {
        return this.taskService.loadTasks(board.boardId).pipe(tap(() => this.switchBoardClient(board)));
    }

    public getBoards(): Observable<Board[]> {
        return this.http.get<Board[]>(`${environment.apiUrl}/board`).pipe(tap((boards) => this.getBoardsClient(boards)));
    }

    public addBoard(board: Board): Observable<Board> {
        return this.http
            .post<Board>(`${environment.apiUrl}/board`, board, { withCredentials: true })
            .pipe(tap((value) => this.addBoardClient(value)));
    }

    public editBoard(board: Board): Observable<Board> {
        return this.http
            .put<Board>(`${environment.apiUrl}/board`, board, { withCredentials: true })
            .pipe(tap((value) => this.editBoardClient(value)));
    }

    public deleteBoard(id: number): Observable<number> {
        return this.http
            .delete<number>(`${environment.apiUrl}/board/${id}`, { withCredentials: true })
            .pipe(tap((id) => this.deleteBoardClient(id)));
    }

    private getBoardsClient(boards: Board[]): void {
        this.boards.splice(0, this.boards.length);
        boards.forEach((board) => this.boards.push(board));
    }

    private addBoardClient(board: Board): void {
        this.boards.push(board);
    }

    private editBoardClient(board: Board): void {
        const index = this.boards.findIndex((item) => item.boardId === board.boardId);
        if (index !== -1) {
            this.boards[index] = board;
        }
    }

    private deleteBoardClient(id: number): void {
        const index = this.boards.findIndex((item) => item.boardId === id);
        if (index !== -1) {
            this.boards.splice(index, 1);
        }
    }

    private switchBoardClient(board: Board): void {
        this.currentBoardSource$.next(board);
    }
}
