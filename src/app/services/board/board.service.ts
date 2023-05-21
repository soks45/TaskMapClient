import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MessagesService } from '@services/messages.service';
import { TaskService } from '@services/task/task.service';
import { AccessRights, Board } from 'app/models/board';
import { CRUD } from 'app/models/CRUD';
import { AsyncSubject, BehaviorSubject, mergeMap, Observable, share, tap } from 'rxjs';

export interface ShareBoard {
    boardId: number;
    accessRights: AccessRights;
    userIdList: number[];
}

@Injectable({
    providedIn: 'root',
})
export class BoardService implements CRUD<Board> {
    readonly content$: Observable<Board[]>;
    private boardSource: BehaviorSubject<Board[]> = new BehaviorSubject<Board[]>([]);
    cache$: Observable<Board[]> | undefined;

    constructor(private http: HttpClient, private messages: MessagesService, private taskService: TaskService) {
        this.content$ = this.boardSource.asObservable();
    }

    get(): Observable<Board[]> {
        return this.load().pipe(mergeMap(() => this.content$));
    }

    add(entity: Board): Observable<void> {
        return this.http
            .post<void>(`${environment.apiUrl}/board`, entity, { withCredentials: true })
            .pipe(tap(() => this.reload()));
    }

    edit(entity: Board): Observable<void> {
        return this.http
            .put<void>(`${environment.apiUrl}/board`, entity, { withCredentials: true })
            .pipe(tap(() => this.reload()));
    }

    delete(entity: Board): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/board/${entity.boardId}`, { withCredentials: true }).pipe(
            tap(() => {
                this.reload();
                this.taskService.removeSource(entity.boardId);
            })
        );
    }

    share(entity: ShareBoard): Observable<void> {
        return this.http
            .post<void>(`${environment.apiUrl}/board/share`, entity, { withCredentials: true })
            .pipe(tap(() => this.reload()));
    }

    private load(): Observable<Board[]> {
        if (!this.cache$) {
            this.cache$ = this.http.get<Board[]>(`${environment.apiUrl}/board`, { withCredentials: true }).pipe(
                share({
                    connector: () => new AsyncSubject(),
                    resetOnError: false,
                    resetOnComplete: false,
                    resetOnRefCountZero: false,
                })
            );
        }

        return this.cache$.pipe(tap((boards) => this.boardSource.next(boards)));
    }

    private reload(): void {
        this.cache$ = undefined;
        this.load().subscribe();
    }
}
