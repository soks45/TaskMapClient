import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormMixin } from '@mixins/form.mixin';
import { BaseObject } from '@mixins/mixins';
import { BoardService } from '@services/board/board.service';
import { MessagesService } from '@services/messages.service';
import { UserService } from '@services/user.service';
import { Board } from 'app/models/board';
import { Observable, switchMap, take } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

interface CreateBoard {
    boardName: FormControl<string>;
    boardDescription: FormControl<string>;
}

@Component({
    selector: 'tm-create-board-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule,
    ],
    templateUrl: './create-board-dialog.component.html',
    styleUrls: ['./create-board-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateBoardDialogComponent extends FormMixin(BaseObject) {
    isLoading: boolean = false;
    formGroup: FormGroup<CreateBoard>;

    userId = -1;

    constructor(
        private dialogRef: MatDialogRef<boolean>,
        private formBuilder: FormBuilder,
        private messages: MessagesService,
        private boardService: BoardService,
        private userService: UserService
    ) {
        super();

        this.formGroup = this.formBuilder.group({
            boardName: new FormControl('new board', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            boardDescription: new FormControl('', {
                nonNullable: true,
                validators: [Validators.maxLength(255)],
            }),
        });
    }

    onSubmit(): void {
        if (!this.checkForm()) {
            this.messages.error('You have some errors in form');
            return;
        }

        this.isLoading = true;

        this.formValue$
            .pipe(
                switchMap((board) => this.boardService.add(board)),
                finalize(() => (this.isLoading = false))
            )
            .subscribe(() => this.dialogRef.close());
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }

    private get formValue$(): Observable<Board> {
        return this.userService.getUser().pipe(
            take(1),
            map((user) => ({
                userId: user.userId,
                boardId: 0,
                createdDate: new Date().toString(),
                ...this.formGroup.getRawValue(),
            }))
        );
    }
}
