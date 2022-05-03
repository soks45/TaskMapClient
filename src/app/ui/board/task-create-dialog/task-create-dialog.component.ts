import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaskB } from "src/models/task-b";
import { BoardService } from "src/app/services/board.service";
import { formatDate } from '@angular/common';
import { AuthService } from 'src/app/core';
import { User } from 'src/models/user';
import { filter } from 'rxjs';

export interface TemplateFormDialogData {
  template?: TaskB;
}

@Component({
  selector: 'app-task-create-dialog',
  templateUrl: './task-create-dialog.component.html',
  styleUrls: ['./task-create-dialog.component.scss']
})

export class TaskCreateDialogComponent implements OnInit {
  //
  // formGroup: FormGroup;
  // isNew = true;
  // boardId: number = NaN;
  // currentUser: User | {} = {};
  //
  // constructor(
  //   @Inject(MAT_DIALOG_DATA) private data: TemplateFormDialogData,
  //   private dialogRef: MatDialogRef<TemplateFormDialogData, TaskB>,
  //   private dialog: MatDialog,
  //   private fb: FormBuilder,
  //   private authService: AuthService,
  //   private boardService: BoardService,
  // ) {
  //   this.formGroup = this.fb.group({
  //     taskLabel: ['', [Validators.required]],
  //     taskText: ['',[Validators.required]],
  //     color: ['', [Validators.required]]
  //   });
  //   this.boardService.CurrentBoardId$.subscribe(id => this.boardId = id);
  //   // @ts-ignore
  //   this.authService.user$.pipe(filter(user => user !== null)).subscribe(res => this.currentUser = res)
  // }
  //
  ngOnInit(): void {
    // this.setupForm();
    // if (this.data.template) {
    //   this.formGroup.patchValue(this.data.template)
    // }
  }
  //
  // private setupForm(): void {
  //   console.log(this.data.template);
  //   if (this.data.template?.taskId !== undefined) {
  //     this.isNew = false;
  //   }
  //   console.log(this.isNew)
  // }
  //
  // onCloseDialog() {
  //   this.dialogRef.close(this.data.template);
  // }
  //
  // onSubmit() {
  //   this.formGroup.updateValueAndValidity();
  //   console.log(this.isNew, 'isNew');
  //   if (this.isNew) {
  //     this.addTask();
  //   } else {
  //     this.editTask();
  //   }
  // }
  //
  // addTask() {
  //   const currentDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
  //   if (this.data.template && this.currentUser !== {}) {
  //     if ('userId' in this.currentUser) {
  //       const task: TaskB = {
  //         taskLabel: this.formGroup.value.taskLabel,
  //         taskText: this.formGroup.value.taskText,
  //         color: this.formGroup.value.color,
  //         userId: this.currentUser.userId,
  //         boardId: this.boardId,
  //         taskId: Math.floor(Math.random() * 100),
  //         createdDate: currentDate,
  //         state: 0,
  //         coordinates: { x: this.data.template.coordinates.x, y: this.data.template.coordinates.y }
  //       };
  //       this.taskService.addNewTask(task);
  //       this.dialogRef.close(task);
  //     }
  //   }
  // }
  //
  // editTask() {
  //   if (this.data.template) {
  //     this.data.template.taskLabel = this.formGroup.value.taskLabel;
  //     this.data.template.taskText = this.formGroup.value.taskText;
  //     this.data.template.color = this.formGroup.value.color;
  //     this.taskService.newTaskPosition(this.data.template);
  //   }
  //   this.dialogRef.close(this.data.template);
  // }
}
