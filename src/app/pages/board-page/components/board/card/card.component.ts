import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { TaskB } from '@models/task-b';
import { EditCardDialogComponent } from '@pages/board-page/components/board/edit-card-dialog/edit-card-dialog.component';
import { TaskService } from '@services/task.service';
import { takeUntil } from 'rxjs';

export const Colors = ['purple', 'green', 'red'];

@Component({
    selector: 'tm-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent extends DestroyMixin(BaseObject) {
    @Input() task!: TaskB;
    private dialogRef?: MatDialogRef<EditCardDialogComponent, boolean>;

    constructor(private taskService: TaskService, private dialog: MatDialog) {
        super();
    }

    deleteTask(): void {
        this.taskService.delete(this.task).pipe(takeUntil(this.destroyed$)).subscribe();
    }

    editTask() {
        this.dialogRef = this.dialog.open(EditCardDialogComponent, {
            closeOnNavigation: true,
            data: this.task,
        });

        this.dialogRef
            .afterClosed()
            .subscribe
            //TODO do some cool stuff here
            ();
    }

    newTaskPosition($event: CdkDragMove): void {
        const element = $event.source._dragRef;
        const newPosition = element.getFreeDragPosition();
        this.task.coordinates.x = newPosition.x;
        this.task.coordinates.y = newPosition.y;
        this.taskService.moveTask.next(this.task);
    }
}
