import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BaseDataSource } from '@services/data-sources/base.data-source';
import { BoardsDataSource } from '@services/data-sources/boards.data-source';
import { SignalRService } from '@services/signalR.service';
import { TasksService } from '@services/tasks.service';
import { Board } from 'app/models/board';
import { Observable, Subject, switchMap, tap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CurrentBoardDataSource extends BaseDataSource<Board> {
    private reloads$: Subject<number> = new Subject<number>();
    protected dataSource$: Observable<Board> = this.http
        .get<number>(`${environment.apiUrl}/account/last-board`, { withCredentials: true })
        .pipe(
            switchMap((id) => this.signalRService.joinBoard(id)),
            switchMap((id) =>
                this.boards.lastValue().pipe(map((boards) => boards.filter((board) => board.boardId === id)[0]))
            )
        );

    constructor(
        private http: HttpClient,
        private boards: BoardsDataSource,
        private signalRService: SignalRService,
        private tasksService: TasksService
    ) {
        super();
        this.signalRService.hubConnection.on('ReceiveNotification', (id) => this.tasksService.reload(id));
    }

    switchBoard(id: number): Observable<void> {
        return this.http
            .patch<void>(`${environment.apiUrl}/account/last-board/${id}`, null, { withCredentials: true })
            .pipe(tap(() => this.reload()));
    }
}
