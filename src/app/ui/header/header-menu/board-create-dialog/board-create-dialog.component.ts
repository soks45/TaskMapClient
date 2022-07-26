import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Board } from 'src/models/board';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core';
import { BoardService } from 'src/app/services/board.service';
import { NGXLogger } from 'ngx-logger';
import { User } from 'src/models/user';
import { TaskB } from 'src/models/task-b';

export interface FormDialogData {
  template?: Board;
}

@Component({
  selector: 'app-board-create-dialog',
  templateUrl: './board-create-dialog.component.html',
  styleUrls: ['./board-create-dialog.component.scss']
})

export class BoardCreateDialogComponent implements OnInit {
  private readonly ngUnsubscribe$: Subject<void> = new Subject<void>();
  formGroup: FormGroup;
  isNew: boolean = true;
  private currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: FormDialogData,
    private dialogRef: MatDialogRef<FormDialogData, Board>,
    private dialog: MatDialog,
    private authService: AuthService,
    private boardService: BoardService,
    private logger: NGXLogger
  ) {
    this.formGroup = this.fb.group({
      boardName: ['', [Validators.required]],
      boardDescription: ['',[Validators.required]],
    });
    this.authService.user$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => this.currentUser = res);
  }

  ngOnInit(): void {
    this.setupForm();
    if (this.data.template) {
      this.formGroup.patchValue(this.data.template)
    }
  }

  private setupForm(): void {
    this.logger.log(this.data.template);
    if (this.data.template?.boardId !== undefined) {
      this.isNew = false;
    }
    this.logger.log(this.isNew);
  }

  onCloseDialog() {
    this.dialogRef.close(this.data.template);
  }

  onSubmit() {
    this.formGroup.updateValueAndValidity();
    this.logger.trace(this.isNew, 'isNew');
    if (this.isNew) {
      this.addBoard();
    } else {
      this.editBoard();
    }
  }

  addBoard() {
    let board: Board;
    if (this.currentUser !== null) {
      board = {
        boardId: 0,
        createdDate: '',
        boardName: this.formGroup.value.boardName,
        userId: this.currentUser.userId,
        boardDescription: this.formGroup.value.boardDescription
      }
      this.boardService.addBoard(board);
      this.dialogRef.close(board);
    }
    this.dialogRef.close();
  }

  editBoard() {
    // if (this.data.template) {
    //   this.data.template.taskLabel = this.formGroup.value.taskLabel;
    //   this.data.template.taskText = this.formGroup.value.taskText;
    //   this.data.template.color = this.formGroup.value.color;
    //   this.boardService.editTask(this.data.template).then(() => this.dialogRef.close(this.data.template))
    //       .catch((e) => this.logger.error(e));
    // }
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.unsubscribe();
  }
}
