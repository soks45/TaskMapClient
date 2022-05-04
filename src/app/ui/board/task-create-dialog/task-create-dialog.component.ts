import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaskB } from "src/models/task-b";
import { BoardService } from "src/app/services/board.service";
import { formatDate } from '@angular/common';
import { AuthService } from 'src/app/core';
import { User } from 'src/models/user';
import { filter, Subject, takeUntil } from 'rxjs';

export interface TemplateFormDialogData {
  template?: TaskB;
}

@Component({
  selector: 'app-task-create-dialog',
  templateUrl: './task-create-dialog.component.html',
  styleUrls: ['./task-create-dialog.component.scss']
})

export class TaskCreateDialogComponent implements OnInit, OnDestroy {

  private readonly ngUnsubscribe$: Subject<void> = new Subject<void>();

  formGroup: FormGroup;
  isNew = true;
  boardId: number = 1;
  currentUser: User | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: TemplateFormDialogData,
    private dialogRef: MatDialogRef<TemplateFormDialogData, TaskB>,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private authService: AuthService,
    private boardService: BoardService,
  ) {
    this.formGroup = this.fb.group({
      taskLabel: ['', [Validators.required]],
      taskText: ['',[Validators.required]],
      color: ['', [Validators.required]]
    });
    this.boardService.CurrentBoardId$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(id => this.boardId = id);
    // @ts-ignore
    this.authService.user$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => this.currentUser = res);
  }

  ngOnInit(): void {
    this.setupForm();
    if (this.data.template) {
      this.formGroup.patchValue(this.data.template)
    }
  }

  private setupForm(): void {
    console.log(this.data.template);
    if (this.data.template?.taskId !== undefined) {
      this.isNew = false;
    }
    console.log(this.isNew);
  }

  onCloseDialog() {
    this.dialogRef.close(this.data.template);
  }

  onSubmit() {
    this.formGroup.updateValueAndValidity();
    console.log(this.isNew, 'isNew');
    if (this.isNew) {
      this.addTask();
    } else {
      this.editTask();
    }
  }

  addTask() {
    if (this.data.template && this.currentUser !== null) {
      if ('userId' in this.currentUser) {
        const task: TaskB = {
          taskLabel: this.formGroup.value.taskLabel,
          taskText: this.formGroup.value.taskText,
          color: this.formGroup.value.color,
          userId: this.currentUser.userId,
          boardId: this.boardId,
          taskId: 0,
          createdDate: '',
          state: 0,
          coordinates: { x: this.data.template.coordinates.x, y: this.data.template.coordinates.y }
        };
        this.boardService.addNewTask(task);
        this.dialogRef.close(task);
      }
    }
  }

  editTask() {
    if (this.data.template) {
      this.data.template.taskLabel = this.formGroup.value.taskLabel;
      this.data.template.taskText = this.formGroup.value.taskText;
      this.data.template.color = this.formGroup.value.color;
      this.boardService.editTask(this.data.template);
    }
    this.dialogRef.close(this.data.template);
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.unsubscribe();
  }
}
