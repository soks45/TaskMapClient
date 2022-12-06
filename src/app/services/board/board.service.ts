import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ClearCacheMixin } from '@mixins/clear-cache.mixin';
import { BaseObject } from '@mixins/mixins';
import { Board } from '@models/board';
import { CRUD } from '@models/CRUD';
import { MessagesService } from '@services/messages.service';
import { TaskService } from '@services/task/task.service';
import { AsyncSubject, BehaviorSubject, mergeMap, Observable, share, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class BoardService extends ClearCacheMixin(BaseObject) implements CRUD<Board> {
    readonly content$: Observable<Board[]>;
    private boardSource: BehaviorSubject<Board[]> = new BehaviorSubject<Board[]>([]);
    cache$: Observable<Board[]> | undefined;

    constructor(private http: HttpClient, private messages: MessagesService, private taskService: TaskService) {
        super();
        this.content$ = this.boardSource.asObservable();
    }

    get(): Observable<Board[]> {
        return this.load().pipe(mergeMap(() => this.content$));
    }

    add(entity: Board): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/board`, entity, { withCredentials: true }).pipe(
            catchError((err) => {
                throw err;
            }),
            tap(() => this.reload())
        );
    }

    edit(entity: Board): Observable<void> {
        return this.http.put<void>(`${environment.apiUrl}/board`, entity, { withCredentials: true }).pipe(
            catchError((err) => {
                throw err;
            }),
            tap(() => this.reload())
        );
    }

    delete(entity: Board): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/board/${entity.boardId}`, { withCredentials: true }).pipe(
            catchError((err) => {
                throw err;
            }),
            tap(() => {
                this.reload();
                this.taskService.removeSource(entity.boardId);
            })
        );
    }

    private load(): Observable<Board[]> {
        if (!this.cache$) {
            this.cache$ = this.http.get<Board[]>(`${environment.apiUrl}/board`, { withCredentials: true }).pipe(
                share({
                    connector: () => new AsyncSubject(),
                    resetOnError: false,
                    resetOnComplete: false,
                    resetOnRefCountZero: false,
                }),
                catchError((err) => {
                    this.messages.error(err);
                    this.cache$ = undefined;
                    throw err;
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
