import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BaseDataSource, DataSourceContext } from '@services/data-sources/base.data-source';
import { BoardsDataSource } from '@services/data-sources/boards.data-source';
import { SignalRService } from '@services/signalR.service';
import { Board } from 'app/models/board';
import { Observable, switchMap, tap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CurrentBoardDataSource extends BaseDataSource<Board> {
    protected dataSource$: Observable<Board> = this.http
        .get<number>(`${environment.apiUrl}/account/last-board`, { withCredentials: true })
        .pipe(
            tap((id) => this.signalRService.joinBoard(id)),
            switchMap((id) =>
                this.boards.lastValue().pipe(map((boards) => boards.filter((board) => board.boardId === id)[0]))
            )
        );

    constructor(
        private http: HttpClient,
        private dataSourceContext: DataSourceContext,
        private boards: BoardsDataSource,
        private signalRService: SignalRService
    ) {
        super(dataSourceContext);
    }

    switchBoard(id: number): Observable<void> {
        return this.http
            .patch<void>(`${environment.apiUrl}/account/last-board/${id}`, null, { withCredentials: true })
            .pipe(tap(() => this.reload()));
    }
}
