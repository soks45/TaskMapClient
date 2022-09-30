import { Injectable } from '@angular/core';
import { TaskB, TaskBServer } from '@models/task-b';

@Injectable({
    providedIn: 'root',
})
export class ConverterService {
    constructor() {}

    taskBClient(task: TaskBServer): TaskB {
        return <TaskB>{
            ...task,
            coordinates: JSON.parse(task.coordinates),
        };
    }

    taskBServer(task: TaskB): TaskBServer {
        [task.coordinates.x, task.coordinates.y] = [
            Math.abs(Math.floor(task.coordinates.x)),
            Math.abs(Math.floor(task.coordinates.y)),
        ];
        return <TaskBServer>{
            ...task,
            coordinates: JSON.stringify(task.coordinates),
        };
    }
}
