import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { Injectable } from '@angular/core';
import { DeepReadOnly } from '@models/deep-read-only';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject, skip, take, tap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BoardViewService {
    private boardSizeSource$: BehaviorSubject<Point>;
    private initViewBoardSize$: ReplaySubject<Point>;

    constructor() {
        this.boardSizeSource$ = new BehaviorSubject<Point>({ x: 0, y: 0 });
        this.initViewBoardSize$ = new ReplaySubject<Point>(1);
        this.boardSizeSource$
            .asObservable()
            .pipe(
                take(2),
                skip(1),
                tap((size) => this.initViewBoardSize$.next(size))
            )
            .subscribe();
    }

    initBoardSize(): Observable<Point> {
        return this.initViewBoardSize$.asObservable();
    }

    newSize(size: Point): void {
        this.boardSizeSource$.next(size);
    }

    positions(sizeOfItem: DeepReadOnly<Point>, relativePositions$: Observable<Point>): Observable<Point> {
        return combineLatest([relativePositions$, this.boardSizeSource$.asObservable()]).pipe(
            map(([relativePosition, size]) => this.relativeToAbsolute(relativePosition, sizeOfItem, size))
        );
    }

    absoluteToRelative(position: Point, size: DeepReadOnly<Point> = this.boardSizeSource$.value): Point {
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

    relativeToAbsolute(
        relativePosition: Point,
        sizeOfItem: DeepReadOnly<Point>,
        size: DeepReadOnly<Point> = this.boardSizeSource$.value
    ): Point {
        const absolutePosition = {
            x: relativePosition.x * size.x,
            y: relativePosition.y * size.y,
        };

        if (sizeOfItem.x + absolutePosition.x > size.x) {
            absolutePosition.x = size.x - sizeOfItem.x;
        }

        if (absolutePosition.x < 0) {
            absolutePosition.x = 0;
        }

        if (sizeOfItem.y + absolutePosition.y > size.y) {
            absolutePosition.y = size.y - sizeOfItem.y;
        }

        if (absolutePosition.y < 0) {
            absolutePosition.y = 0;
        }

        return absolutePosition;
    }
}
