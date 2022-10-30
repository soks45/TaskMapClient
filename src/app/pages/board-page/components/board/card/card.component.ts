import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { DeepReadOnly } from '@models/deep-read-only';
import { TaskB } from '@models/task-b';
import { BoardDraggableMixin } from '@pages/board-page/components/board/board-draggable';
import {
    EditCardDialogComponent,
    EditDialogData,
} from '@pages/board-page/components/board/edit-card-dialog/edit-card-dialog.component';
import { TaskService } from '@services/task/task.service';
import { takeUntil, tap } from 'rxjs';

@Component({
    selector: 'tm-card [task] ',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent extends BoardDraggableMixin(DestroyMixin(BaseObject)) {
    readonly size: DeepReadOnly<Point> = {
        x: 210,
        y: 260,
    };

    @Input() task!: TaskB;
    @Input() boundaryClassName?: string;
    @Input() fromCreator: boolean = false;

    constructor(private taskService: TaskService, private dialog: MatDialog) {
        super();

        this.drags$
            .pipe(
                takeUntil(this.destroyed$),
                tap((relativePosition) => {
                    [this.task.x, this.task.y] = [relativePosition.x, relativePosition.y];
                    this.taskService.edit(this.task, false).subscribe();
                })
            )
            .subscribe();
    }

    initItemPosition(boardSize: Point): Point {
        return {
            x: this.task.x,
            y: this.task.y,
        };
    }

    deleteTask(): void {
        if (this.fromCreator) {
            return;
        }

        this.taskService.delete(this.task).subscribe();
    }

    editTask(): void {
        this.dialog.open(EditCardDialogComponent, {
            closeOnNavigation: true,
            data: <EditDialogData>{
                task: this.task,
                isAuthed: true,
                fromCreator: this.fromCreator,
            },
        });
    }
}
