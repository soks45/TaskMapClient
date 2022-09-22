import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { Cached } from 'src/app/decorators/cached';
import { TaskService } from 'src/app/services/task-service';
import { environment } from 'src/environments/environment';
import { Board } from 'src/models/board';
import { TaskB } from 'src/models/task-b';

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

    @Cached()
    public switchBoard(board: Board): Observable<TaskB[]> {
        return this.taskService.loadTasks(board.boardId).pipe(tap(() => this.switchBoardClient(board)));
    }

    @Cached()
    public getBoards(): Observable<Board[]> {
        return this.http.get<Board[]>(`${environment.apiUrl}/board/get-boards`).pipe(tap((boards) => this.getBoardsClient(boards)));
    }

    @Cached()
    public addBoard(board: Board): Observable<Board> {
        return this.http
            .post<Board>(`${environment.apiUrl}/board/add-board`, board, { withCredentials: true })
            .pipe(tap((board) => this.addBoardClient(board)));
    }

    @Cached()
    public editBoard(board: Board): Observable<Board> {
        return this.http
            .put<Board>(`${environment.apiUrl}/board/change-board/${board.boardId}`, board, { withCredentials: true })
            .pipe(tap((board) => this.editBoardClient(board)));
    }

    @Cached()
    public deleteBoard(board: Board): Observable<number> {
        return this.http
            .delete<number>(`${environment.apiUrl}/board/delete-board/${board.boardId}`, { withCredentials: true })
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
