import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskB } from '@models/task-b';
import {
    EditCardDialogComponent,
    EditDialogData,
} from '@pages/board-page/components/board/edit-card-dialog/edit-card-dialog.component';
import { TaskService } from '@services/task.service';
import { TempTaskService } from '@services/temp-task.service';

@Component({
    selector: 'tm-card [task]',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent {
    @Input() task!: TaskB;
    @Input() boundary?: string;
    @Input() fromCreator: boolean = false;
    @Input() isAuthed: boolean = false;

    constructor(
        private taskService: TaskService,
        private dialog: MatDialog,
        private tempTaskService: TempTaskService
    ) {}

    deleteTask(): void {
        if (this.fromCreator) {
            return;
        }

        this.taskService.delete(this.task).subscribe(); //TODO do some cool stuff here
    }

    editTask(): void {
        this.dialog.open(EditCardDialogComponent, {
            closeOnNavigation: true,
            data: <EditDialogData>{
                task: this.task,
                isAuthed: this.isAuthed,
                fromCreator: this.fromCreator,
            },
        });
    }

    newTaskPosition(event: CdkDragEnd): void {
        const newPosition = event.source._dragRef.getFreeDragPosition(); // TODO refactor coordinates
        this.task.coordinates.x = newPosition.x;
        this.task.coordinates.y = newPosition.y;
        if (!this.isAuthed) {
            this.tempTaskService.edit(this.task);
            return;
        }

        this.taskService.edit(this.task).subscribe();
    }
}
