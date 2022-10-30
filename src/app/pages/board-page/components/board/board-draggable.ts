import { CdkDragEnd } from '@angular/cdk/drag-drop';
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

        protected boardView: BoardViewService;
        drags$: Observable<Point>;

        private dragsSource$: Subject<Point>;
        private relativePositions$: Subject<Point>;

        protected constructor(...args: any[]) {
            super(args);

            this.boardView = inject(BoardViewService);
            this.relativePositions$ = new Subject<Point>();
            this.drags$ = this.dragsSource$ = new Subject<Point>();
            this.drags$ = this.dragsSource$.asObservable();
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
                .pipe(tap((boardSize) => this.relativePositions$.next(this.initItemPosition(boardSize))))
                .subscribe();
        }

        onDnDEnd($event: CdkDragEnd): void {
            const newRelativePosition = this.boardView.absoluteToRelative($event.source._dragRef.getFreeDragPosition());
            this.relativePositions$.next(newRelativePosition);
            this.dragsSource$.next(newRelativePosition);
        }

        abstract readonly size: Point;
        abstract destroyed$: Observable<void>;

        abstract initItemPosition(boardSize: Point): Point;
    }

    return BoardDraggableClass;
}