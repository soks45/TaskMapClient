import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ValidateFormDirective } from '@directives/validate-form.directive';
import { BoardsDataSource } from '@services/data-sources/boards.data-source';
import { MessagesService } from '@services/messages.service';
import { Board } from 'app/models/board';
import { finalize } from 'rxjs/operators';

interface EditBoard {
    boardName: string;
    boardDescription: string;
}

interface EditBoardControls {
    boardName: FormControl<string>;
    boardDescription: FormControl<string>;
}

@Component({
    selector: 'tm-edit-board-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule,
        ValidateFormDirective,
    ],
    templateUrl: './edit-board-dialog.component.html',
    styleUrls: ['./edit-board-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditBoardDialogComponent {
    isLoading: boolean = false;
    formGroup: FormGroup<EditBoardControls>;

    constructor(
        private dialogRef: MatDialogRef<boolean>,
        private formBuilder: FormBuilder,
        private messages: MessagesService,
        private boardService: BoardsDataSource,
        @Inject(MAT_DIALOG_DATA) private data: Board
    ) {
        this.formGroup = this.formBuilder.group<EditBoardControls>({
            boardName: new FormControl(data.boardName, {
                nonNullable: true,
                validators: [Validators.required, Validators.maxLength(16)],
            }),
            boardDescription: new FormControl(data.boardDescription, {
                nonNullable: true,
                validators: [Validators.maxLength(255)],
            }),
        });
    }

    onSubmit(value: EditBoard): void {
        this.isLoading = true;

        this.boardService
            .edit({
                ...this.data,
                ...value,
            })
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => this.dialogRef.close());
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
