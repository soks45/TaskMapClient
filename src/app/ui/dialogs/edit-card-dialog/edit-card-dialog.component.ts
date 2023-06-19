import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ValidateFormDirective } from '@directives/validate-form.directive';
import { TaskCreatorService } from '@services/task-creator.service';
import { TasksService } from '@services/tasks.service';
import { Color, Colors, State, TaskB } from 'app/models/task-b';
import { finalize } from 'rxjs/operators';

export interface EditDialogData {
    fromCreator: boolean;
    task: TaskB;
}

interface EditCard {
    taskLabel: string;
    taskText: string;
    color: Color;
    state: State;
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
        ValidateFormDirective,
    ],
})
export class EditCardDialogComponent {
    isNew = false;
    Colors = Colors;
    states = [
        {
            value: State.Main,
            label: 'Main',
        },
        {
            value: State.Short,
            label: 'Short',
        },
    ];
    isLoading: boolean = false;
    formGroup: FormGroup<EditCardForm>;

    constructor(
        private dialogRef: MatDialogRef<TaskB>,
        private formBuilder: FormBuilder,
        private taskService: TasksService,
        @Inject(MAT_DIALOG_DATA)
        private data: EditDialogData,
        private taskCreator: TaskCreatorService
    ) {
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

    onSubmit(value: EditCard): void {
        const formValue: TaskB = {
            ...this.data.task,
            ...value,
        };

        if (this.data.fromCreator) {
            this.taskCreator.edit(formValue);
            this.dialogRef.close();
            return;
        }

        this.isLoading = true;
        this.taskService
            .edit(formValue)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => this.dialogRef.close());
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
