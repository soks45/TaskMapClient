import { Point } from '@angular/cdk/drag-drop';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TasksService } from '@services/tasks.service';
import { EditCardDialogComponent, EditDialogData } from '@ui/dialogs/edit-card-dialog/edit-card-dialog.component';
import { State, TaskB } from 'app/models/task-b';

@Component({
    selector: 'tm-card [task]',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass, NgIf, MatIconModule, DatePipe, MatDialogModule],
})
export class CardComponent {
    @Input() task!: TaskB;
    @Input() fromCreator: boolean = false;
    readonly states = State;

    constructor(private taskService: TasksService, private dialog: MatDialog) {}

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
        if (this.fromCreator) {
            return;
        }

        this.taskService
            .edit({
                ...this.task,
                ...newPosition,
            })
            .subscribe();
    }

    changeState(): void {
        if (this.fromCreator) {
            return;
        }

        this.taskService
            .edit({
                ...this.task,
                state: this.task.state === this.states.Main ? this.states.Short : this.states.Main,
            })
            .subscribe();
    }
}
