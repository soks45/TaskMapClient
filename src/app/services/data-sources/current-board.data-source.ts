import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BoardsDataSource } from '@services/data-sources/boards.data-source';
import { SignalRService } from '@services/signalR.service';
import { Board } from 'app/models/board';
import { Observable, of, switchMap, tap } from 'rxjs';
import { DataSubject } from 'rxjs-data-subject';

@Injectable({
    providedIn: 'root',
})
export class CurrentBoardDataSource extends DataSubject<Board | null> {
    constructor(private http: HttpClient, private boards: BoardsDataSource, private signalRService: SignalRService) {
        super(
            http
                .get<number | null>(`${environment.apiUrl}/account/last-board`, { withCredentials: true })
                .pipe(switchMap((id) => (id ? this.boards.get(id) : of(null))))
        );

        this.signalRService.hubConnection.on('BoardChangedNotification', () => this.reload());
    }

    switchBoard(id: number): Observable<void> {
        return this.http
            .patch<void>(`${environment.apiUrl}/account/last-board/${id}`, null, { withCredentials: true })
            .pipe(tap(() => this.reload()));
    }
}
