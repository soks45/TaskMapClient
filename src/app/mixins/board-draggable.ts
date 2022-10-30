import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { Directive, inject, OnInit } from '@angular/core';
import { Constructor } from '@mixins/mixins';
import { BoardViewService } from '@pages/board-page/components/board/board-view.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

export function BoardDraggableMixin<TBase extends Constructor>(Base: TBase) {
    @Directive()
    abstract class BoardDraggableClass extends Base implements OnInit {
        absolutePosition: Point = {
            x: 0,
            y: 0,
        };
        relativePositions$: Subject<Point> = new Subject<Point>();

        abstract size: Point;
        abstract destroyed$: Observable<void>;

        boardView: BoardViewService;

        protected constructor(...args: any[]) {
            super(args);

            this.boardView = inject(BoardViewService);
            this.relativePositions$ = new Subject<Point>();
        }

        ngOnInit(): void {
            this.boardView
                .positions(this.size, this.relativePositions$)
                .pipe(
                    takeUntil(this.destroyed$),
                    tap((newPosition) => (this.absolutePosition = newPosition))
                )
                .subscribe();

            this.boardView
                .initBoardSize()
                .pipe(tap((boardSize) => this.initItemPosition(boardSize)))
                .subscribe();
        }

        abstract initItemPosition(boardSize: Point): void;
    }

    return BoardDraggableClass;
}
