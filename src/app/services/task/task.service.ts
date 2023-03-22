import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ConverterService } from '@services/converter.service';
import { MessagesService } from '@services/messages.service';
import { MemoryStorage } from 'app/helpers/memory-storage';
import { CRUD } from 'app/models/CRUD';
import { TaskB } from 'app/models/task-b';
import { AsyncSubject, mergeMap, Observable, ReplaySubject, share, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

// TODO refactor this service
@Injectable({
    providedIn: 'root',
})
export class TaskService implements CRUD<TaskB> {
    readonly tasks: MemoryStorage<number, Observable<TaskB[]>> = new MemoryStorage();
    private tasksSource: MemoryStorage<number, ReplaySubject<TaskB[]>> = new MemoryStorage();
    private cache: MemoryStorage<number, Observable<TaskB[]>> = new MemoryStorage();

    constructor(private http: HttpClient, private messages: MessagesService, private converter: ConverterService) {}

    get(id: number): Observable<TaskB[]> {
        return this.load(id).pipe(mergeMap(() => this.tasks.getItem(id)!));
    }

    add(entity: TaskB): Observable<void> {
        return this.http
            .post<void>(`${environment.apiUrl}/task`, this.converter.taskBServer(entity), { withCredentials: true })
            .pipe(
                catchError((err) => {
                    throw err;
                }),
                tap(() => this.reload(entity.boardId))
            );
    }

    edit(entity: TaskB): Observable<void> {
        return this.http
            .put<void>(`${environment.apiUrl}/task`, this.converter.taskBServer(entity), { withCredentials: true })
            .pipe(
                catchError((err) => {
                    throw err;
                }),
                tap(() => this.reload(entity.boardId))
            );
    }

    moveTaskInList(taskId: number, previousTaskId: number, boardId: number, newBoardId: number): Observable<void> {
        return this.http
            .put<void>(`${environment.apiUrl}/task/list/${taskId}&${newBoardId}&${previousTaskId}`, {
                withCredentials: true,
            })
            .pipe(
                tap(() => {
                    this.reload(boardId);

                    if (boardId !== newBoardId) {
                        this.reload(newBoardId);
                    }
                })
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

    removeSource(id: number): void {
        const source = this.tasksSource.getItem(id);
        source?.complete();
        source?.unsubscribe();
        this.tasksSource.removeItem(id);
        this.tasks.removeItem(id);
    }

    private reload(id: number): void {
        this.cache.removeItem(id);
        this.load(id).subscribe();
    }

    private load(id: number): Observable<TaskB[]> {
        if (!this.cache.getItem(id)) {
            this.cache.setItem(
                id,
                this.http.get<TaskB[]>(`${environment.apiUrl}/task/${id}`, { withCredentials: true }).pipe(
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
                    })
                )
            );
        }

        if (!this.tasksSource.getItem(id)) {
            this.addSource(id);
        }

        return this.cache.getItem(id)!.pipe(tap((tasks) => this.tasksSource.getItem(id)!.next(tasks)));
    }

    private addSource(id: number): void {
        const source: ReplaySubject<TaskB[]> = new ReplaySubject<TaskB[]>(1);
        this.tasksSource.setItem(id, source);
        this.tasks.setItem(id, source.asObservable());
    }
}
