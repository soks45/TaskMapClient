import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { Color, TaskB } from '@models/task-b';
import { Boundary } from '@pages/board-page/components/board/board.component';
import { ConverterService } from '@services/converter.service';
import { TaskCreatorService } from '@services/task-creator.service';
import { TaskService } from '@services/task.service';
import { Observable, takeUntil, tap } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'tm-task-creator [boundaryCreator]',
    templateUrl: './task-creator.component.html',
    styleUrls: ['./task-creator.component.scss'],
    providers: [DatePipe],
    animations: [
        trigger('smoothAppearance', [
            state('void', style({ opacity: 0.5 })),
            state('*', style({ opacity: 1 })),
            transition('void => *', animate(200)),
            transition('* => void', animate(100)),
        ]),
    ],
})
export class TaskCreatorComponent extends DestroyMixin(BaseObject) implements AfterViewInit {
    creatorCardBoundary: Boundary = { boundaryClassName: '' };
    readonly cardCreatorSize: Point = {
        x: 304,
        y: 374,
    };

    @Input() boundaryCreator!: Boundary;

    isLoading: boolean = false;
    isShowing: boolean = true;
    isFirstResize: boolean = true;
    isProtectingDragAction: boolean = false;

    colorType = Color;
    creatorTask$: Observable<TaskB>;

    size: Point = {
        x: 0,
        y: 0,
    };
    position: Point = {
        x: 0,
        y: 0,
    };
    relativePosition: Point = {
        x: 0.7,
        y: 0.05,
    };

    constructor(
        private taskService: TaskService,
        private taskCreator: TaskCreatorService,
        private converter: ConverterService
    ) {
        super();
        this.creatorTask$ = this.taskCreator.creatorTask$;
    }

    ngAfterViewInit(): void {
        if (this.boundaryCreator.boundarySize) {
            const resizes$ = this.boundaryCreator.boundarySize.pipe(takeUntil(this.destroyed$));
            resizes$
                .pipe(
                    tap((size) => {
                        if (this.isFirstResize) {
                            this.relativePosition = {
                                x: 1 - (this.cardCreatorSize.x / size.x + 0.03), // top right corner
                                y: 0.03,
                            };

                            this.isFirstResize = !this.isFirstResize;
                        }
                    })
                )
                .subscribe((newSize) => this.onResize(newSize));
        }
    }

    changeColor(color: Color): void {
        this.taskCreator.edit({ color: color });
    }

    onCreate(creatorTask: TaskB): void {
        const newTask = this.setNewTaskPosition(creatorTask);

        this.isLoading = true;
        this.taskService
            .add(newTask)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => (this.isShowing = !this.isShowing));
    }

    onDnDEnded($event: CdkDragEnd): void {
        this.newPosition($event.source._dragRef.getFreeDragPosition());
        this.setPosition();
    }

    onShow(): void {
        this.isShowing = !this.isShowing;
    }

    private onResize(newSize: Point): void {
        this.size = newSize;
        this.setPosition();
    }

    private setPosition(): void {
        this.position = this.converter.fractionToPosition(
            {
                x: this.relativePosition.x,
                y: this.relativePosition.y,
            },
            this.size,
            this.cardCreatorSize
        );
    }

    private newPosition(newPos: Point): void {
        newPos = this.converter.positionToFraction(newPos, this.size);
        this.relativePosition.x = newPos.x;
        this.relativePosition.y = newPos.y;
    }

    private setNewTaskPosition(task: TaskB): TaskB {
        const newTask: TaskB = {
            ...task,
        };

        newTask.x = (this.position.x + 20) / this.size.x;
        newTask.y = (this.position.y + 55) / this.size.y;

        return newTask;
    }
}
