import { animate, state, style, transition, trigger } from '@angular/animations';
import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { Board } from '@models/board';
import { TaskB } from '@models/task-b';
import { ShortUser } from '@models/user';
import { AuthService } from '@services/auth.service';
import { CurrentBoardService } from '@services/board/current-board.service';
import { TaskService } from '@services/task/task.service';
import { InitItemPosition } from '@ui/adaptive-drag/draggable';
import { concatWith, fromEvent, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Boundary {
    boundaryClassName: string;
    boundarySize?: Observable<Point>;
}

@Component({
    selector: 'tm-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
    animations: [
        trigger('smoothAppearance', [
            state('void', style({ opacity: 0.5 })),
            state('*', style({ opacity: 1 })),
            transition('void => *', animate(200)),
        ]),
    ],
})
export class BoardComponent extends DestroyMixin(BaseObject) implements AfterViewInit {
    tasks$?: Observable<TaskB[]>;
    currentBoard$: Observable<Board>;
    user$: Observable<ShortUser | null>;
    boundaryClassName = 'board';
    resizes$: Observable<Point>;
    ngAfterViewInit$: Subject<null>;

    @ViewChild('boardElement')
        boardElement!: ElementRef;

    constructor(
        private taskService: TaskService,
        private currentBoard: CurrentBoardService,
        private auth: AuthService
    ) {
        super();
        this.user$ = this.auth.user$;
        this.currentBoard$ = this.currentBoard.currentBoard().pipe(
            takeUntil(this.destroyed$),
            tap((b) => (this.tasks$ = this.taskService.get(b.boardId)))
        );

        this.ngAfterViewInit$ = new Subject<null>();

        this.resizes$ = this.ngAfterViewInit$.pipe(
            takeUntil(this.destroyed$),
            map(() => this.BoundarySize),
            concatWith(
                of(true).pipe(
                    concatWith(fromEvent(window, 'resize')),
                    map(() => this.BoundarySize)
                )
            )
        );
    }

    ngAfterViewInit(): void {
        this.ngAfterViewInit$.complete();
    }

    readonly initCreatorPosition: InitItemPosition = (size: Point, sizeOfItem: Point): Point => ({
        x: 1 - (sizeOfItem.x / size.x + 0.03),
        y: 0.03,
    });
    readonly initCardPosition: InitItemPosition = (_: Point, __: Point): Point => ({ x: 0, y: 0 });

    onDnD(position: Point): void {
        console.log(position);
    }

    get BoundarySize(): Point {
        return <Point>{
            x: this.boardElement.nativeElement.offsetWidth,
            y: this.boardElement.nativeElement.offsetHeight,
        };
    }

    contextMenu(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
    }
}
