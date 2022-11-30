import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Point } from '@angular/cdk/drag-drop/drag-ref';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { DragViewService } from '@ui/adaptive-drag/drag-view.service';
import { filter, merge, Subject, take, takeUntil, tap } from 'rxjs';

export type InitItemPosition = (boundarySize: Point, itemSize: Point) => Point;

@Component({
    selector: 'tm-adaptive-drag [initItemPosition] [boundary]',
    templateUrl: './adaptive-drag.component.html',
    styleUrls: ['./adaptive-drag.component.scss'],
})
export class AdaptiveDragComponent extends DestroyMixin(BaseObject) implements AfterViewInit {
    @Input() initItemPosition!: InitItemPosition;
    @Input() boundary!: ElementRef<HTMLElement> | HTMLElement;
    @ViewChild('dragItem') dragItem?: ElementRef;
    @Output() newPosition: EventEmitter<Point> = new EventEmitter<Point>();
    isProtectingDragAction: boolean = false;
    boundarySize: Point = {
        x: 0,
        y: 0,
    };
    itemSize: Point = {
        x: 0,
        y: 0,
    };
    absolutePosition: Point = {
        x: 0,
        y: 0,
    };
    relativePosition: Point = {
        x: 0,
        y: 0,
    };
    resizesBoundary$: Subject<void> = new Subject<void>();
    resizesItem$: Subject<void> = new Subject<void>();

    constructor(private dragView: DragViewService, private cdr: ChangeDetectorRef) {
        super();
    }

    ngAfterViewInit(): void {
        this.observeResizes(this.dragItem, (v) => {
            this.setItemSize(v[0].contentRect);
            this.resizesItem$.next();
        });

        this.observeResizes(this.boundary, (v) => {
            this.setBoundarySize(v[0].contentRect);
            this.resizesBoundary$.next();
        });

        const rBoundary$ = this.resizesBoundary$.pipe(
            takeUntil(this.destroyed$),
            filter(() => this.isInited),
            tap(() => this.setAbsolutePosition())
        );

        rBoundary$.subscribe();

        const rItem$ = this.resizesItem$.pipe(
            takeUntil(this.destroyed$),
            filter(() => this.isInited),
            tap(() => this.setRelativePosition())
        );

        rItem$.subscribe();

        merge(rItem$, rBoundary$)
            .pipe(
                takeUntil(this.destroyed$),
                take(1),
                tap(() => {
                    this.relativePosition = this.initItemPosition(this.boundarySize, this.itemSize);
                    this.setAbsolutePosition();
                })
            )
            .subscribe();
    }

    onDnDEnd($event: CdkDragEnd) {
        this.absolutePosition = $event.source.getFreeDragPosition();
        this.setRelativePosition();
    }

    getRelativePositionForPoint(point: Point): Point {
        return this.dragView.absoluteToRelative(point, this.itemSize, this.boundarySize);
    }

    private observeResizes(
        element: ElementRef<HTMLElement> | HTMLElement | undefined = undefined,
        callback: ResizeObserverCallback
    ): void {
        if (!element) {
            return;
        }

        const HTMLElement = element instanceof ElementRef<HTMLElement> ? element.nativeElement : element;
        const observer = new ResizeObserver(callback);
        observer.observe(HTMLElement as Element);
        this.destroyed$.subscribe(() => observer.unobserve(HTMLElement as Element));
    }

    private setBoundarySize(rect: DOMRectReadOnly): void {
        this.boundarySize = {
            x: rect.width,
            y: rect.height,
        };
    }

    private setItemSize(rect: DOMRectReadOnly): void {
        this.itemSize = {
            x: rect.width,
            y: rect.height,
        };
    }

    private setAbsolutePosition(): void {
        this.absolutePosition = this.dragView.relativeToAbsolute(
            this.relativePosition,
            this.itemSize,
            this.boundarySize
        );

        this.cdr.detectChanges();
    }

    private setRelativePosition(): void {
        this.relativePosition = this.dragView.absoluteToRelative(
            this.absolutePosition,
            this.itemSize,
            this.boundarySize
        );

        this.newPosition.next(this.relativePosition);
    }

    private get isInited(): boolean {
        return this.boundarySize.x !== 0 && this.boundarySize.y !== 0 && this.itemSize.x !== 0 && this.itemSize.y !== 0;
    }
}
