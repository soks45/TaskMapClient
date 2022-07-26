import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaskB } from "src/models/task-b";
import { BoardService } from "src/app/services/board.service";
import { AuthService } from 'src/app/core';
import { User } from 'src/models/user';
import { Subject, takeUntil } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

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
  private id: number = -1;
  private currentUser: User | null = null;

  formGroup: FormGroup;
  isNew = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: TemplateFormDialogData,
    private dialogRef: MatDialogRef<TemplateFormDialogData, TaskB>,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private authService: AuthService,
    private boardService: BoardService,
    private logger: NGXLogger
  ) {
    this.formGroup = this.fb.group({
      taskLabel: ['', [Validators.required]],
      taskText: ['',[Validators.required]],
      color: ['', [Validators.required]]
    });
    // @ts-ignore
    this.authService.user$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => this.currentUser = res);
    this.boardService.CurrentBoardId$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(id => this.id = id);
  }

  ngOnInit(): void {
    this.setupForm();
    if (this.data.template) {
      this.formGroup.patchValue(this.data.template)
    }
  }

  private setupForm(): void {
    this.logger.log(this.data.template);
    if (this.data.template?.taskId !== undefined) {
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
      this.addTask();
    } else {
      this.editTask();
    }
  }

  addTask() {
    this.logger.log(this.data.template, this.currentUser, this.boardService.CurrentBoardId);
    if (this.data.template && this.currentUser !== null && this.boardService.CurrentBoardId !== -1) {
      if ('userId' in this.currentUser) {
        const task: TaskB = {
          taskLabel: this.formGroup.value.taskLabel,
          taskText: this.formGroup.value.taskText,
          color: this.formGroup.value.color,
          userId: this.currentUser.userId,
          boardId: this.boardService.CurrentBoardId,
          taskId: 0,
          createdDate: '',
          state: 0,
          coordinates: { x: this.data.template.coordinates.x, y: this.data.template.coordinates.y }
        };
        this.boardService.addNewTask(task).then(
          () => this.dialogRef.close(task)
        ).catch((e) => this.logger.error(e));
      }
    }
  }

  editTask() {
    if (this.data.template) {
      this.data.template.taskLabel = this.formGroup.value.taskLabel;
      this.data.template.taskText = this.formGroup.value.taskText;
      this.data.template.color = this.formGroup.value.color;
      this.boardService.editTask(this.data.template).then(() => this.dialogRef.close(this.data.template))
          .catch((e) => this.logger.error(e));
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.unsubscribe();
  }
}
