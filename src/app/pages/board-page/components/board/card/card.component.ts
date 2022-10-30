import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BoardDraggableMixin } from '@mixins/board-draggable';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { DeepReadOnly } from '@models/deep-read-only';
import { TaskB } from '@models/task-b';
import {
    EditCardDialogComponent,
    EditDialogData,
} from '@pages/board-page/components/board/edit-card-dialog/edit-card-dialog.component';
import { TaskService } from '@services/task/task.service';

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
    }

    initItemPosition(boardSize: Point): void {
        this.relativePositions$.next({
            x: this.task.x,
            y: this.task.y,
        });
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

    onDnDEnd($event: CdkDragEnd): void {
        const newRelativePosition = this.boardView.absoluteToRelative($event.source._dragRef.getFreeDragPosition());
        [this.task.x, this.task.y] = [newRelativePosition.x, newRelativePosition.y];
        this.relativePositions$.next(newRelativePosition);
        this.taskService.edit(this.task, false).subscribe();
    }
}
