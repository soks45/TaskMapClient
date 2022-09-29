import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CRUD } from '@models/CRUD';
import { TaskB, TaskBServer } from '@models/task-b';
import { ConverterService } from '@services/converter.service';
import { MessagesService } from '@services/messages.service';
import { MemoryStorage } from 'app/helpers/memory-storage';
import { asyncScheduler, AsyncSubject, BehaviorSubject, mergeMap, Observable, share, Subject, tap, throttleTime } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class TaskService implements CRUD<TaskB> {
    readonly content: MemoryStorage<number, Observable<TaskB[]>> = new MemoryStorage();
    readonly moveTask: Subject<TaskB> = new Subject<TaskB>();
    private taskSource: MemoryStorage<number, BehaviorSubject<TaskB[]>> = new MemoryStorage();
    private cache: MemoryStorage<number, Observable<TaskB[]>> = new MemoryStorage();

    constructor(private http: HttpClient, private messages: MessagesService, private converter: ConverterService) {
        this.moveTask
            .pipe(
                throttleTime(20, asyncScheduler, { leading: true, trailing: true }),
                tap((task) => this.move(task).subscribe())
            )
            .subscribe();
    }

    get(id: number): Observable<TaskB[]> {
        return this.load(id).pipe(mergeMap(() => this.content.getItem(id)!));
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

    delete(entity: TaskB): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/task/${entity.taskId}`, { withCredentials: true }).pipe(
            catchError((err) => {
                throw err;
            }),
            tap(() => this.reload(entity.boardId))
        );
    }

    private reload(id: number): void {
        this.cache.removeItem(id);
        this.load(id).subscribe();
    }

    private load(id: number): Observable<TaskB[]> {
        if (!this.cache.getItem(id)) {
            this.cache.setItem(
                id,
                this.http.get<TaskBServer[]>(`${environment.apiUrl}/task/${id}`, { withCredentials: true }).pipe(
                    share({
                        connector: () => new AsyncSubject(),
                        resetOnError: false,
                        resetOnComplete: false,
                        resetOnRefCountZero: false,
                    }),
                    catchError((err) => {
                        this.messages.error(err);
                        this.cache.removeItem(id);
                        throw err;
                    }),
                    map((tasks) => tasks.map((task) => this.converter.taskBClient(task)))
                )
            );
        }

        if (!this.taskSource.getItem(id)) {
            const source: BehaviorSubject<TaskB[]> = new BehaviorSubject<TaskB[]>([]);
            source.subscribe((value) => console.log(value));
            this.taskSource.setItem(id, source);
            this.content.setItem(id, source.asObservable());
        }

        return this.cache.getItem(id)!.pipe(tap((tasks) => this.taskSource.getItem(id)!.next(tasks)));
    }

    private move(entity: TaskB): Observable<void> {
        return this.http.put<void>(`${environment.apiUrl}/task`, this.converter.taskBServer(entity), { withCredentials: true }).pipe(
            catchError((err) => {
                throw err;
            })
        );
    }
}
