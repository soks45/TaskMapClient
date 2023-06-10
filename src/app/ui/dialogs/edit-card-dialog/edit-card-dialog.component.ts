import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BaseForm } from '@mixins/form';
import { MessagesService } from '@services/messages.service';
import { TaskCreatorDataSource } from '@services/data-sources/task-creator.data-source';
import { TasksService } from '@services/tasks.service';
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        NgIf,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        NgFor,
        MatOptionModule,
        MatButtonModule,
    ],
})
export class EditCardDialogComponent extends BaseForm {
    isNew = false;
    Colors = Colors;
    States = States;
    isLoading: boolean = false;
    formGroup: FormGroup<EditCardForm>;

    constructor(
        private dialogRef: MatDialogRef<TaskB>,
        private formBuilder: FormBuilder,
        private taskService: TasksService,
        private messages: MessagesService,
        @Inject(MAT_DIALOG_DATA)
        private data: EditDialogData,
        private taskCreator: TaskCreatorDataSource
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
