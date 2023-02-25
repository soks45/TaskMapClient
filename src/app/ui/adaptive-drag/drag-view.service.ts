import { Point } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { DeepReadOnly } from '@models/deep-read-only';

@Injectable()
export class DragViewService {
    absoluteToRelative(
        absolutePosition: Point,
        itemSize: DeepReadOnly<Point>,
        boundarySize: DeepReadOnly<Point>
    ): Point {
        const relativePosition: Point = {
            x: absolutePosition.x / boundarySize.x,
            y: absolutePosition.y / boundarySize.y,
        };

        if (itemSize.x >= boundarySize.x || itemSize.x === 0 || Number.isNaN(itemSize.x)) {
            relativePosition.x = 0;
        }

        if (itemSize.y >= boundarySize.y || itemSize.y === 0 || Number.isNaN(itemSize.y)) {
            relativePosition.y = 0;
        }

        return relativePosition;
    }

    relativeToAbsolute(
        relativePosition: Point,
        itemSize: DeepReadOnly<Point>,
        boundarySize: DeepReadOnly<Point>
    ): Point {
        const absolutePosition: Point = {
            x: relativePosition.x * boundarySize.x,
            y: relativePosition.y * boundarySize.y,
        };

        if (itemSize.x >= boundarySize.x || itemSize.x === 0 || Number.isNaN(itemSize.x)) {
            absolutePosition.x = 0;
        }

        if (itemSize.y >= boundarySize.y || itemSize.y === 0 || Number.isNaN(itemSize.y)) {
            absolutePosition.y = 0;
        }

        if (boundarySize.x - absolutePosition.x < itemSize.x) {
            absolutePosition.x = boundarySize.x - itemSize.x;
        }

        if (boundarySize.y - absolutePosition.y < itemSize.y) {
            absolutePosition.y = boundarySize.y - itemSize.y;
        }

        return absolutePosition;
    }
}
