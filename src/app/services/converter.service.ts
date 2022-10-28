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

    fractionToPosition(fraction: Point, size: Point, sizeOfItem: Point = { x: 0, y: 0 }): Point {
        const position = {
            // TODO fix logic
            x: fraction.x * size.x,
            y: fraction.y * size.y,
        };

        if (sizeOfItem.x + position.x > size.x) {
            position.x = size.x - sizeOfItem.x;
        }

        if (position.x < 0) {
            position.x = 0;
        }

        if (sizeOfItem.y + position.y > size.y) {
            position.y = size.y - sizeOfItem.y;
        }

        if (position.y < 0) {
            position.y = 0;
        }

        return position;
    }

    positionToFraction(position: Point, size: Point, sizeOfItem: Point = { x: 0, y: 0 }): Point {
        const fraction = {
            x: position.x / size.x,
            y: position.y / size.y,
        };

        if (fraction.x < 0) {
            fraction.x = 0;
        }

        if (fraction.y < 0) {
            fraction.y = 0;
        }

        return fraction;
    }
}
