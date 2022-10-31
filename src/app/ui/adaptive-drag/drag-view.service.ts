import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { Injectable } from '@angular/core';
import { DeepReadOnly } from '@models/deep-read-only';
import { combineLatest, concatMap, Observable, of, OperatorFunction, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

function tapOnce<T>(tapFn: (t: T) => void, tapIndex = 0): OperatorFunction<T, T> {
    return (source$) =>
        source$.pipe(
            concatMap((value, index) => {
                if (index === tapIndex) {
                    tapFn(value);
                }
                return of(value);
            })
        );
}

@Injectable()
export class DragViewService {
    positions(
        sizesOfItem$: Observable<Point>,
        relativePositions$: Subject<Point>,
        dragFieldSize$: Observable<Point>
    ): Observable<Point> {
        return combineLatest([relativePositions$, dragFieldSize$, sizesOfItem$]).pipe(
            map(([relativePosition, size, sizeOfItem]) => this.relativeToAbsolute(relativePosition, sizeOfItem, size))
        );
    }

    relatives(absolutePositions$: Observable<Point>, dragFieldSize$: Observable<Point>): Observable<Point> {
        return combineLatest([absolutePositions$, dragFieldSize$]).pipe(
            map(([position, size]) => this.absoluteToRelative(position, size))
        );
    }

    private absoluteToRelative(position: Point, size: DeepReadOnly<Point>): Point {
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

    private relativeToAbsolute(
        relativePosition: Point,
        sizeOfItem: DeepReadOnly<Point>,
        size: DeepReadOnly<Point>
    ): Point {
        const absolutePosition = {
            x: relativePosition.x * size.x,
            y: relativePosition.y * size.y,
        };

        if (sizeOfItem.x + absolutePosition.x > size.x) {
            absolutePosition.x = size.x - sizeOfItem.x;
        }

        if (sizeOfItem.y + absolutePosition.y > size.y) {
            absolutePosition.y = size.y - sizeOfItem.y;
        }

        if (absolutePosition.x < 0) {
            absolutePosition.x = 0;
        }

        if (absolutePosition.y < 0) {
            absolutePosition.y = 0;
        }

        return absolutePosition;
    }
}
