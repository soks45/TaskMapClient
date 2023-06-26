import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MessagesService } from '@services/messages.service';
import { SignalRService } from '@services/signalR.service';
import { TasksService } from '@services/tasks.service';
import { AccessRights, Board } from 'app/models/board';
import { forkJoin, Observable, of, switchMap, tap } from 'rxjs';
import { DataSubject } from 'rxjs-data-subject';
import { map } from 'rxjs/operators';

export interface ShareBoard {
    boardId: number;
    accessRights: AccessRights;
    userIdList: number[];
}

@Injectable({
    providedIn: 'root',
})
export class BoardsDataSource extends DataSubject<Board[]> {
    private processed: Set<number> = new Set<number>();

    constructor(
        private http: HttpClient,
        private taskService: TasksService,
        private signalRService: SignalRService,
        private messages: MessagesService
    ) {
        super(
            http
                .get<Board[]>(`${environment.apiUrl}/board`, {
                    withCredentials: true,
                })
                .pipe(switchMap((boards: Board[]) => this.joinBoards(boards)))
        );

        this.listenHub();
    }

    get(boardId: number): Observable<Board> {
        return this.http.get<Board>(`${environment.apiUrl}/board/${boardId}`, {
            withCredentials: true,
        });
    }

    add(entity: Board): Observable<void> {
        return this.http
            .post<void>(`${environment.apiUrl}/board`, entity, {
                withCredentials: true,
            })
            .pipe(tap(() => this.reload()));
    }

    edit(entity: Board): Observable<void> {
        return this.http.put<void>(`${environment.apiUrl}/board`, entity, { withCredentials: true }).pipe(
            tap(() => this.reload()),
            switchMap(() => this.signalRService.sendBoardChangedEvent(entity.boardId))
        );
    }

    delete(entity: Board): Observable<void> {
        return this.http
            .delete<void>(`${environment.apiUrl}/board/${entity.boardId}`, {
                withCredentials: true,
            })
            .pipe(
                tap(() => {
                    this.reload();
                    this.taskService.remove(entity.boardId);
                }),
                switchMap(() => this.signalRService.sendBoardChangedEvent(entity.boardId))
            );
    }

    share(entity: ShareBoard): Observable<void> {
        return this.http
            .post<void>(`${environment.apiUrl}/board/share`, entity, {
                withCredentials: true,
            })
            .pipe(
                tap(() => this.reload()),
                switchMap(() => this.signalRService.sendShareBoardNotificationEvent(entity.userIdList))
            );
    }

    unShare(entity: Board): Observable<void> {
        return this.http
            .put<void>(
                `${environment.apiUrl}/board/unshare/${entity.boardId}`,
                {},
                {
                    withCredentials: true,
                }
            )
            .pipe(
                tap(() => this.reload()),
                switchMap(() => this.signalRService.sendBoardChangedEvent(entity.boardId))
            );
    }

    private joinBoards(boards: Board[]): Observable<Board[]> {
        const unProcessed = boards.filter((b) => !this.processed.has(b.boardId));

        if (unProcessed.length === 0) {
            return of(boards);
        }

        return forkJoin(
            unProcessed
                .map((board) => {
                    this.processed.add(board.boardId);
                    return board;
                })
                .map((board) => this.signalRService.joinBoard(board.boardId))
        ).pipe(map(() => boards));
    }

    private listenHub(): void {
        this.signalRService.hubConnection.on('BoardChangedNotification', () => this.reload());
        this.signalRService.hubConnection.on('ShareBoardNotification', () => this.reload());
        this.signalRService.hubConnection.onclose(() => this.processed.clear());
    }
}
