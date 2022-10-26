import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { Injectable } from '@angular/core';
import { TaskB } from '@models/task-b';

@Injectable({
    providedIn: 'root',
})
export class ConverterService {
    constructor() {}

    taskBServer(task: TaskB): TaskB {
        [task.x, task.y] = [parseFloat(Math.abs(task.x).toFixed(4)), parseFloat(Math.abs(task.y).toFixed(4))];
        return task;
    }

    fractionToPosition(fraction: Point, size: Point): Point {
        return {
            x: fraction.x * size.x,
            y: fraction.y * size.y,
        };
    }

    positionToFraction(position: Point, size: Point): Point {
        return {
            x: position.x / size.x,
            y: position.y / size.y,
        };
    }
}
