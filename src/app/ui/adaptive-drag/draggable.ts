import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { Directive, EventEmitter, OnInit } from '@angular/core';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject, Constructor } from '@mixins/mixins';
import { DragViewService } from '@ui/adaptive-drag/drag-view.service';
import { combineLatest, Observable, Subject, take, takeUntil, tap } from 'rxjs';

export type InitItemPosition = (boxSize: Point, itemSize: Point) => Point;

export function DraggableMixin<TBase extends Constructor>(Base: TBase) {
    @Directive()
    abstract class BoardDraggableClass extends DestroyMixin(BaseObject) implements OnInit {
        abstract absolutePosition: Point;
        abstract readonly dragView: DragViewService;
        abstract initItemPosition: InitItemPosition;
        abstract boundaryResizes: Observable<Point>;
        abstract itemSizes$: Observable<Point>;
        abstract DnDEnd: EventEmitter<Point>;

        private relativePositionsSource$: Subject<Point> = new Subject<Point>();

        protected constructor(...args: any[]) {
            super(args);
        }

        ngOnInit(): void {
            combineLatest([this.boundaryResizes, this.itemSizes$])
                .pipe(
                    take(1),
                    tap(([size, sizeOfItem]) =>
                        this.relativePositionsSource$.next(this.initItemPosition(size, sizeOfItem))
                    )
                )
                .subscribe(); // init position

            this.dragView
                .positions(this.itemSizes$, this.relativePositionsSource$, this.boundaryResizes)
                .pipe(
                    takeUntil(this.destroyed$),
                    tap((newPosition) => (this.absolutePosition = newPosition))
                )
                .subscribe(); // reposition
        }

        onDnDEnd($event: CdkDragEnd): void {
            const newRelativePosition = this.dragView.absoluteToRelative($event.source._dragRef.getFreeDragPosition());
            this.relativePositionsSource$.next(newRelativePosition);
            this.DnDEnd.emit(newRelativePosition);
            console.log(newRelativePosition);
        }
    }

    return BoardDraggableClass;
}
