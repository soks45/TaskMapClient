import { animate, state, style, transition, trigger } from '@angular/animations';
import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { DeepReadOnly } from '@models/deep-read-only';
import { Color, TaskB } from '@models/task-b';
import { TaskCreatorService } from '@services/task/task-creator.service';
import { TaskService } from '@services/task/task.service';
import { DragViewService } from '@ui/adaptive-drag/drag-view.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'tm-task-creator',
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
export class TaskCreatorComponent extends DestroyMixin(BaseObject) {
    readonly size: DeepReadOnly<Point> = {
        x: 304,
        y: 374,
    };

    isLoading: boolean = false;
    isShowing: boolean = true;
    isProtectingDragAction: boolean = false;

    colorType = Color;
    creatorTask$: Observable<TaskB>;

    constructor(
        private taskService: TaskService,
        private taskCreator: TaskCreatorService,
        protected dragView: DragViewService
    ) {
        super();
        this.creatorTask$ = this.taskCreator.creatorTask$;
    }

    changeColor(color: Color): void {
        this.taskCreator.edit({ color: color });
    }

    onCreate(creatorTask: TaskB): void {
        const newPos: Point = { x: 0, y: 0 }; /*this.boardView.absoluteToRelative({
                    x: this.absolutePosition.x + 20,
                    y: this.absolutePosition.y + 55,
                });*/
        this.taskService
            .add({ ...creatorTask, ...newPos })
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => (this.isShowing = !this.isShowing));
    }

    initItemPosition(boardSize: Point): Point {
        return {
            x: 1 - (this.size.x / boardSize.x + 0.03),
            y: 0.03,
        };
    }
}
