import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { State, TaskB } from '@models/task-b';
import { Colors } from '@pages/board-page/components/board/card/card.component';
import { AuthService } from '@services/auth.service';
import { TaskService } from '@services/task.service';
import { finalize } from 'rxjs/operators';

export interface BaseTask {
    userId: number;
    boardId: number;
}

@Component({
    selector: 'tm-edit-card-dialog',
    templateUrl: './edit-card-dialog.component.html',
    styleUrls: ['./edit-card-dialog.component.scss'],
})
export class EditCardDialogComponent {
    formGroup: UntypedFormGroup;
    Colors = Colors;
    States = [State.Main, State.Short];
    isNew = true;
    readonly task: TaskB;

    constructor(
        private dialogRef: MatDialogRef<Event | TaskB>,
        private formBuilder: UntypedFormBuilder,
        private taskService: TaskService,
        private auth: AuthService,
        @Inject(MAT_DIALOG_DATA) private baseTask: TaskB | BaseTask
    ) {
        this.task = this.getNewTask(baseTask);
        this.formGroup = this.formBuilder.group({
            taskLabel: [this.task.taskLabel, [Validators.required]],
            taskText: [this.task.taskText, [Validators.maxLength(1024)]],
            color: [this.task.color, []],
            state: [this.task.state, []],
        });
    }

    onSubmit(): void {
        if (!this.task) {
            return;
        }
        // TODO add validation

        const editedTask: TaskB = {
            ...this.task,
            ...this.formGroup.value,
        };

        if (this.isNew) {
            this.taskService
                .add(editedTask)
                .pipe(finalize(() => this.dialogRef.close(true)))
                .subscribe();
            return;
        }

        this.taskService
            .edit(editedTask)
            .pipe(finalize(() => this.dialogRef.close(true)))
            .subscribe();
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }

    private getNewTask(baseTask: BaseTask | TaskB): TaskB {
        if ('taskId' in baseTask) {
            this.isNew = false;
        }

        const newTask = {
            taskId: 0,
            state: State.Main,
            color: Colors[0],
            taskText: '',
            taskLabel: 'New Task',
            coordinates: { x: 0, y: 0 },
            createdDate: '',
        };

        return <TaskB>{
            ...newTask,
            ...baseTask,
        };
    }
}
