import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormMixin } from '@mixins/form.mixin';
import { BaseObject } from '@mixins/mixins';
import { BoardService, ShareBoard } from '@services/board/board.service';
import { UserService } from '@services/user.service';
import { DestroyService } from 'app/helpers/destroy.service';
import { AccessRights, Board } from 'app/models/board';
import { ShortUser } from 'app/models/user';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {
    AsyncSubject,
    debounceTime,
    distinctUntilChanged,
    Observable,
    share,
    startWith,
    Subject,
    takeUntil,
    withLatestFrom,
} from 'rxjs';
import { finalize, map } from 'rxjs/operators';

interface ShareBoardControls {
    accessRights: FormControl<AccessRights>;
    userIdList: FormControl<number[]>;
}

@Component({
    selector: 'tm-share-board-dialog',
    standalone: true,
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        ReactiveFormsModule,
        NgFor,
        NgIf,
        AsyncPipe,
        NgxMatSelectSearchModule,
    ],
    providers: [DestroyService],
    templateUrl: './share-board-dialog.component.html',
    styleUrls: ['./share-board-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareBoardDialogComponent extends FormMixin(BaseObject) {
    accessRights = Object.values(AccessRights);
    isLoading = false;

    formGroup: FormGroup<ShareBoardControls>;
    multiSelect: FormControl<string> = new FormControl<string>('', { nonNullable: true });

    filter$: Subject<string>;
    filteredUsers$: Observable<ShortUser[]>;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: Board,
        private fb: FormBuilder,
        public userService: UserService,
        private destroyed$: DestroyService,
        private boardService: BoardService,
        private dialogRef: MatDialogRef<boolean>
    ) {
        super();

        this.formGroup = this.fb.group({
            accessRights: new FormControl(AccessRights.readOnly, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            userIdList: new FormControl<number[]>([], {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });

        this.filter$ = new Subject<string>();

        this.filteredUsers$ = this.filter$.pipe(
            startWith(''),
            debounceTime(1000),
            distinctUntilChanged(),
            withLatestFrom(
                this.userService.getUsers().pipe(
                    share<ShortUser[]>({
                        connector: () => new AsyncSubject(),
                        resetOnError: false,
                        resetOnComplete: false,
                        resetOnRefCountZero: false,
                    }),
                    withLatestFrom(this.userService.getUser()),
                    map((value) => value[0].filter((user) => value[1].userId !== user.userId))
                )
            ),
            map((value) => value[1].filter((user) => user.username.includes(value[0]))),
            takeUntil(this.destroyed$)
        );
    }

    onSubmit(): void {
        if (!this.checkForm()) {
            return;
        }

        this.boardService
            .share(this.formValue)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => this.dialogRef.close(true));
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }

    filterMyOptions(searchString: string) {
        this.filter$.next(searchString);
    }

    private get formValue(): ShareBoard {
        return {
            boardId: this.data.boardId,
            ...this.formGroup.value,
        } as ShareBoard;
    }
}
