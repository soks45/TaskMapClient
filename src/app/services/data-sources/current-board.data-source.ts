import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BaseDataSource, DataSourceContext } from '@services/data-sources/base.data-source';
import { Board } from 'app/models/board';
import { Observable, switchMap, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CurrentBoardDataSource extends BaseDataSource<Board> {
    protected dataSource$ = this.http
        .get<number>(`${environment.apiUrl}/account/last-board`, { withCredentials: true })
        .pipe(switchMap((id) => this.http.get<Board>(`${environment.apiUrl}/board/${id}`, { withCredentials: true })));

    constructor(private http: HttpClient, private dataSourceContext: DataSourceContext) {
        super(dataSourceContext);
    }

    switchBoard(id: number): Observable<void> {
        return this.http
            .patch<void>(`${environment.apiUrl}/account/last-board/${id}`, null, { withCredentials: true })
            .pipe(tap(() => this.reload()));
    }
}
