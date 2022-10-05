import { Injectable } from '@angular/core';
import { TaskB } from '@models/task-b';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TempTaskService {
    readonly tempTasks$: Observable<TaskB[]>;
    private readonly tempTasksSource: BehaviorSubject<TaskB[]>;

    constructor() {
        this.tempTasksSource = new BehaviorSubject<TaskB[]>([]);
        this.tempTasks$ = this.tempTasksSource.asObservable();
    }

    create(entity: TaskB): Observable<void> {
        return of(void 0);
    }

    edit(entity: TaskB): Observable<void> {
        return of(void 0);
    }

    delete(entity: TaskB): Observable<void> {
        return of(void 0);
    }
}
