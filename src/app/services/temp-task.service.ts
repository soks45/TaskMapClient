import { Injectable } from '@angular/core';
import { TaskB } from '@models/task-b';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TempTaskService {
    readonly tempTasks$: Observable<TaskB[]>;
    private readonly tempTasksSource: BehaviorSubject<TaskB[]>;

    private tempTasks: TaskB[] = [];
    private tempBoardId: number = -1;
    private tempUserId: number = -1;

    constructor() {
        this.tempTasksSource = new BehaviorSubject<TaskB[]>(this.tempTasks);
        this.tempTasks$ = this.tempTasksSource.asObservable();
    }

    create(entity: TaskB): void {
        const task = <TaskB>{
            ...entity,
            boardId: this.tempBoardId,
            userId: this.tempUserId,
            taskId: this.getNewTaskId(),
        };

        this.tempTasks.push(task);
        this.reload();
    }

    edit(entity: TaskB): void {
        const id = this.tempTasks.findIndex((value) => entity.taskId === value.taskId);
        this.tempTasks[id] = entity;
        this.tempTasks[id].coordinates = {
            ...entity.coordinates,
        };
        this.reload();
    }

    delete(entity: TaskB): void {
        const id = this.tempTasks.findIndex((value) => entity.taskId === value.taskId);
        this.tempTasks.splice(id, 1);
        this.reload();
    }

    private getNewTaskId(): number {
        if (this.tempTasks.length === 0) {
            return 0;
        }

        return Math.max(...this.tempTasks.map((o) => o.taskId)) + 1;
    }

    private reload(): void {
        this.tempTasksSource.next(this.tempTasks);
    }
}
