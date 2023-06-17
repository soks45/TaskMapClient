import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { boardGroupHeader } from '@interceptors/board-group.interceptor';
import { BaseDataSource } from '@services/data-sources/base.data-source';
import { TasksService } from '@services/tasks.service';
import { AccessRights, Board } from 'app/models/board';
import { Observable, tap } from 'rxjs';

export interface ShareBoard {
    boardId: number;
    accessRights: AccessRights;
    userIdList: number[];
}

@Injectable({
    providedIn: 'root',
})
export class BoardsDataSource extends BaseDataSource<Board[]> {
    protected dataSource$: Observable<Board[]> = this.http.get<Board[]>(`${environment.apiUrl}/board`, {
        withCredentials: true,
    });

    constructor(private http: HttpClient, private taskService: TasksService) {
        super();
    }

    add(entity: Board): Observable<void> {
        return this.http
            .post<void>(`${environment.apiUrl}/board`, entity, {
                withCredentials: true,
                headers: boardGroupHeader(),
            })
            .pipe(tap(() => this.reload()));
    }

    edit(entity: Board): Observable<void> {
        return this.http
            .put<void>(`${environment.apiUrl}/board`, entity, { withCredentials: true, headers: boardGroupHeader() })
            .pipe(tap(() => this.reload()));
    }

    delete(entity: Board): Observable<void> {
        return this.http
            .delete<void>(`${environment.apiUrl}/board/${entity.boardId}`, {
                withCredentials: true,
                headers: boardGroupHeader(),
            })
            .pipe(
                tap(() => {
                    this.reload();
                    this.taskService.remove(entity.boardId);
                })
            );
    }

    share(entity: ShareBoard): Observable<void> {
        return this.http
            .post<void>(`${environment.apiUrl}/board/share`, entity, {
                withCredentials: true,
                headers: boardGroupHeader(),
            })
            .pipe(tap(() => this.reload()));
    }
}
