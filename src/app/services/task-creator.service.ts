import { Injectable } from '@angular/core';
import { ChartModel } from '@models/chart-model';
import { Color, State, TaskB } from '@models/task-b';
import { BehaviorSubject, Observable } from 'rxjs';

interface EditTask {
    taskId?: number;
    boardId?: number;
    coordinates?: ChartModel;
    userId?: number;
    createdDate?: string;
    taskLabel?: string;
    taskText?: string;
    color?: Color;
    state?: State;
}

@Injectable({
    providedIn: 'root',
})
export class TaskCreatorService {
    readonly creatorTask$: Observable<TaskB>;
    private creatorTaskSource: BehaviorSubject<TaskB>;

    constructor() {
        this.creatorTaskSource = new BehaviorSubject<TaskB>(this.createNewDefaultTask());
        this.creatorTask$ = this.creatorTaskSource.asObservable();
    }

    edit(task: EditTask): void {
        this.creatorTaskSource.next({
            ...this.creatorTaskSource.value,
            ...task,
        });
    }

    createNewDefaultTask(): TaskB {
        return {
            taskId: 1,
            taskText: 'some task definition',
            state: State.Main,
            coordinates: {
                x: 0,
                y: 0,
            },
            taskLabel: 'New Task',
            createdDate: new Date().toString(),
            color: Color.Green,
            boardId: -1,
            userId: -1,
        };
    }
}
