import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BoardsDataSource } from '@services/data-sources/boards.data-source';
import { Board } from 'app/models/board';
import { Observable, switchMap, tap } from 'rxjs';
import { DataSubject } from 'rxjs-data-subject';

@Injectable({
    providedIn: 'root',
})
export class CurrentBoardDataSource extends DataSubject<Board> {
    constructor(private http: HttpClient, private boards: BoardsDataSource) {
        super(
            http
                .get<number>(`${environment.apiUrl}/account/last-board`, { withCredentials: true })
                .pipe(switchMap((id) => this.boards.get(id)))
        );
    }

    switchBoard(id: number): Observable<void> {
        return this.http
            .patch<void>(`${environment.apiUrl}/account/last-board/${id}`, null, { withCredentials: true })
            .pipe(tap(() => this.reload()));
    }
}
