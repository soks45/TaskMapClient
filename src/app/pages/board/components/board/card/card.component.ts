import { Point } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { TaskB } from '@models/task-b';
import {
    EditCardDialogComponent,
    EditDialogData,
} from '@pages/board/components/board/edit-card-dialog/edit-card-dialog.component';
import { TaskService } from '@services/task/task.service';

@Component({
    selector: 'tm-card [task] ',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent extends DestroyMixin(BaseObject) {
    @Input() task!: TaskB;
    @Input() fromCreator: boolean = false;

    constructor(private taskService: TaskService, private dialog: MatDialog) {
        super();
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

    newTaskPosition(newPosition: Point): void {
        this.taskService
            .edit(
                {
                    ...this.task,
                    ...newPosition,
                },
                false
            )
            .subscribe();
    }
}
