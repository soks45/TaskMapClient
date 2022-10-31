import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BaseObject } from '@mixins/mixins';
import { DragViewService } from '@ui/adaptive-drag/drag-view.service';
import { DraggableMixin, InitItemPosition } from '@ui/adaptive-drag/draggable';
import { distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'tm-adaptive-drag [initItemPosition] [dragBoundaryClassName] [boundaryResizes]',
    templateUrl: './adaptive-drag.component.html',
    styleUrls: ['./adaptive-drag.component.scss'],
})
export class AdaptiveDragComponent extends DraggableMixin(BaseObject) {
    @Input() dragBoundaryClassName!: string;
    @Input() boundaryResizes!: Observable<Point>;
    @Input() initItemPosition!: InitItemPosition;
    @Output() DnDEnd: EventEmitter<Point> = new EventEmitter<Point>();
    @ViewChild('dragItem') dragItem?: ElementRef;
    absolutePosition!: Point;
    isProtectingDragAction: boolean = false;

    itemSizes$: Observable<Point>;
    private readonly itemSizesSource$: Subject<Point>;

    constructor(readonly dragView: DragViewService) {
        super();

        this.itemSizesSource$ = new Subject<Point>();
        this.itemSizes$ = this.itemSizesSource$.pipe(
            takeUntil(this.destroyed$),
            distinctUntilChanged((prev, curr) => prev.x === curr.x && prev.y === curr.y)
        );
    }

    contentChanged() {
        this.itemSizesSource$.next({
            x: this.dragItem?.nativeElement.childNodes[0].childNodes[0].offsetWidth,
            y: this.dragItem?.nativeElement.childNodes[0].childNodes[0].offsetHeight,
        });
    }
}
