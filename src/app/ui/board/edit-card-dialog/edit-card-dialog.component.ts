import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormMixin } from '@mixins/form.mixin';
import { BaseObject } from '@mixins/mixins';
import { MessagesService } from '@services/messages.service';
import { TaskCreatorService } from '@services/task/task-creator.service';
import { TaskService } from '@services/task/task.service';
import { Color, Colors, State, States, TaskB } from 'app/models/task-b';
import { finalize } from 'rxjs/operators';

export interface EditDialogData {
    fromCreator: boolean;
    isAuthed: boolean;
    task: TaskB;
}

interface EditCardForm {
    taskLabel: FormControl<string>;
    taskText: FormControl<string>;
    color: FormControl<Color>;
    state: FormControl<State>;
}

@Component({
    selector: 'tm-edit-card-dialog',
    templateUrl: './edit-card-dialog.component.html',
    styleUrls: ['./edit-card-dialog.component.scss'],
})
export class EditCardDialogComponent extends FormMixin(BaseObject) {
    isNew = false;
    Colors = Colors;
    States = States;
    isLoading: boolean = false;
    formGroup: FormGroup<EditCardForm>;

    constructor(
        private dialogRef: MatDialogRef<TaskB>,
        private formBuilder: FormBuilder,
        private taskService: TaskService,
        private messages: MessagesService,
        @Inject(MAT_DIALOG_DATA)
        private data: EditDialogData,
        private taskCreator: TaskCreatorService
    ) {
        super();
        if (this.data.fromCreator) {
            this.isNew = true;
        }

        this.formGroup = this.formBuilder.group({
            taskLabel: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, Validators.maxLength(255)],
            }),
            taskText: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, Validators.maxLength(1024)],
            }),
            color: new FormControl(Color.Red, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            state: new FormControl(State.Main, {
                nonNullable: true,
                validators: [Validators.required, Validators.maxLength(255)],
            }),
        });

        this.formGroup.patchValue(this.data.task);
    }

    onSubmit(): void {
        if (!this.checkForm()) {
            this.messages.error('You have some errors in form');
            return;
        }

        if (this.data.fromCreator) {
            this.taskCreator.edit(this.formValue);
            this.dialogRef.close();
            return;
        }

        if (this.data.isAuthed) {
            this.isLoading = true;
            this.taskService
                .edit(this.formValue)
                .pipe(finalize(() => (this.isLoading = false)))
                .subscribe(() => this.dialogRef.close());
            return;
        }
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }

    private get formValue(): TaskB {
        return {
            ...this.data.task,
            ...this.formGroup.value,
        };
    }
}
