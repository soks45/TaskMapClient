import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { TaskB } from '@models/task-b';
import { EditCardDialogComponent } from '@pages/board-page/components/board/edit-card-dialog/edit-card-dialog.component';
import { TaskService } from '@services/task.service';

export const Colors = ['purple', 'green', 'red'];

@Component({
    selector: 'tm-card [task]',
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
        this.taskService.delete(this.task).subscribe(); //TODO do some cool stuff here
    }

    editTask() {
        this.dialogRef = this.dialog.open(EditCardDialogComponent, {
            closeOnNavigation: true,
            data: this.task,
        });

        this.dialogRef.afterClosed().subscribe(); //TODO do some cool stuff here
    }

    newTaskPosition(event: CdkDragEnd | CdkDragStart): void {
        const newPosition = event.source._dragRef.getFreeDragPosition();
        this.task.coordinates.x = newPosition.x;
        this.task.coordinates.y = newPosition.y;
        this.taskService.moveTask(this.task).subscribe();
    }
}
