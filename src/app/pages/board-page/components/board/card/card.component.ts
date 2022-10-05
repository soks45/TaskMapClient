import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskB } from '@models/task-b';
import {
    EditCardDialogComponent,
    EditDialogData,
} from '@pages/board-page/components/board/edit-card-dialog/edit-card-dialog.component';
import { TaskService } from '@services/task.service';

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

    constructor(private taskService: TaskService, private dialog: MatDialog) {}

    deleteTask(): void {
        if (this.fromCreator) {
            return;
        }

        this.taskService.delete(this.task).subscribe(); //TODO do some cool stuff here
    }

    editTask(): void {
        const dialogRef = this.dialog.open(EditCardDialogComponent, {
            closeOnNavigation: true,
            data: <EditDialogData>{
                task: this.task,
                isAuthed: this.isAuthed,
                fromCreator: this.fromCreator,
            },
        });

        if (this.fromCreator) {
            return;
        }

        //TODO do some cool stuff here
    }

    newTaskPosition(event: CdkDragEnd): void {
        const newPosition = event.source._dragRef.getFreeDragPosition();
        this.task.coordinates.x = newPosition.x;
        this.task.coordinates.y = newPosition.y;
        this.taskService.edit(this.task).subscribe();
    }
}
