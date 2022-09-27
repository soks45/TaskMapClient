import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CRUD } from '@models/CRUD';
import { TaskB, TaskBServer } from '@models/task-b';
import { ConverterService } from '@services/converter.service';
import { MessagesService } from '@services/messages.service';
import { asyncScheduler, AsyncSubject, BehaviorSubject, mergeMap, Observable, share, Subject, tap, throttleTime } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class TaskService implements CRUD<TaskB> {
    readonly content$: Observable<TaskB[]>;
    readonly moveTask: Subject<TaskB> = new Subject<TaskB>();
    private taskSource: BehaviorSubject<TaskB[]> = new BehaviorSubject<TaskB[]>([]);
    private cache$: Observable<TaskB[]> | undefined;
    private lastId: number | undefined;

    constructor(private http: HttpClient, private messages: MessagesService, private converter: ConverterService) {
        this.content$ = this.taskSource.asObservable();
        this.moveTask
            .pipe(
                throttleTime(30, asyncScheduler, { leading: true, trailing: true }),
                tap((task) => this.move(task).subscribe())
            )
            .subscribe();
    }

    get(id: number): Observable<TaskB[]> {
        return this.load(id).pipe(mergeMap(() => this.cache$!));
    }

    add(entity: TaskB): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/task`, this.converter.taskBServer(entity), { withCredentials: true }).pipe(
            catchError((err) => {
                throw err;
            }),
            tap(() => this.reload(entity.boardId))
        );
    }

    edit(entity: TaskB): Observable<void> {
        return this.http.put<void>(`${environment.apiUrl}/task`, this.converter.taskBServer(entity), { withCredentials: true }).pipe(
            catchError((err) => {
                throw err;
            }),
            tap(() => this.reload(entity.boardId))
        );
    }

    delete(taskId: number, boardId: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/task/${taskId}`, { withCredentials: true }).pipe(
            catchError((err) => {
                throw err;
            }),
            tap(() => this.reload(boardId))
        );
    }

    private reload(id: number): void {
        this.cache$ = undefined;
        this.lastId = id;
        this.load(id).subscribe();
    }

    private load(id: number): Observable<TaskB[]> {
        if (!this.cache$ || (this.cache$ && this.lastId !== id)) {
            this.cache$ = this.http.get<TaskBServer[]>(`${environment.apiUrl}/task/${id}`, { withCredentials: true }).pipe(
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
                }),
                map((tasks) => tasks.map((task) => this.converter.taskBClient(task)))
            );
        }

        return this.cache$.pipe(tap((tasks) => this.taskSource.next(tasks)));
    }

    private move(entity: TaskB): Observable<void> {
        return this.http.put<void>(`${environment.apiUrl}/task`, this.converter.taskBServer(entity), { withCredentials: true }).pipe(
            catchError((err) => {
                throw err;
            })
        );
    }
}
