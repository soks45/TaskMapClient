import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ValidateFormDirective } from '@directives/validate-form.directive';
import { BoardsDataSource } from '@services/data-sources/boards.data-source';
import { MessagesService } from '@services/messages.service';
import { UserDataSource } from '@services/data-sources/user-data-source';
import { AccessRights, Board } from 'app/models/board';
import { User } from 'app/models/user';
import { switchMap } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

interface CreateBoard {
    boardName: string;
    boardDescription: string;
}

interface CreateBoardControls {
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
        ValidateFormDirective,
    ],
    templateUrl: './create-board-dialog.component.html',
    styleUrls: ['./create-board-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateBoardDialogComponent {
    isLoading: boolean = false;
    formGroup: FormGroup<CreateBoardControls>;

    userId = -1;

    constructor(
        private dialogRef: MatDialogRef<boolean>,
        private formBuilder: FormBuilder,
        private messages: MessagesService,
        private boardService: BoardsDataSource,
        private userService: UserDataSource
    ) {
        this.formGroup = this.formBuilder.group<CreateBoardControls>({
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

    onSubmit(value: CreateBoard): void {
        this.isLoading = true;

        this.userService
            .state()
            .pipe(
                map(
                    (user: User) =>
                        <Board>{
                            userId: user.userId,
                            boardId: 0,
                            accessRights: AccessRights.administrating,
                            isShared: true,
                            createdDate: new Date().toString(),
                            ...value,
                        }
                ),
                switchMap((board) => this.boardService.add(board)),
                finalize(() => (this.isLoading = false))
            )
            .subscribe(() => this.dialogRef.close());
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
