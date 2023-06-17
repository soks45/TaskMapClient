import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BoardsDataSource } from '@services/data-sources/boards.data-source';
import { SignalRService } from '@services/signalR.service';
import { TasksService } from '@services/tasks.service';
import { Board } from 'app/models/board';
import { Observable, switchMap, take, tap } from 'rxjs';
import { DataSubject } from 'rxjs-data-subject';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CurrentBoardDataSource extends DataSubject<Board> {
    constructor(
        private http: HttpClient,
        private boards: BoardsDataSource,
        private signalRService: SignalRService,
        private tasksService: TasksService
    ) {
        super(
            http.get<number>(`${environment.apiUrl}/account/last-board`, { withCredentials: true }).pipe(
                switchMap((id) => this.signalRService.joinBoard(id)),
                switchMap((id) =>
                    this.boards.state().pipe(
                        take(1),
                        map((boards) => boards.filter((board) => board.boardId === id)[0])
                    )
                )
            )
        );

        this.signalRService.hubConnection.on('ReceiveNotification', (id) => this.tasksService.reload(Number(id)));
    }

    switchBoard(id: number): Observable<void> {
        return this.http
            .patch<void>(`${environment.apiUrl}/account/last-board/${id}`, null, { withCredentials: true })
            .pipe(tap(() => this.reload()));
    }
}
