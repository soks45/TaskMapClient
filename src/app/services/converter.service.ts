import { Injectable } from '@angular/core';
import { TaskB } from 'app/models/task-b';

@Injectable({
    providedIn: 'root',
})
export class ConverterService {
    constructor() {}

    taskBServer(task: TaskB): TaskB {
        [task.x, task.y] = [parseFloat(Math.abs(task.x).toFixed(4)), parseFloat(Math.abs(task.y).toFixed(4))];
        return task;
    }
}
