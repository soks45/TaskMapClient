import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs';
import { DestroyMixin } from 'src/app/mixins/destroy.mixin';
import { BaseObject } from 'src/app/mixins/mixins';
import {
  EditCardDialogComponent
} from 'src/app/pages/board-page/components/board/edit-card-dialog/edit-card-dialog.component';
import { TaskService } from 'src/app/services/task-service';
import { TaskB } from 'src/models/task-b';

export const Colors = ['purple', 'green', 'red']

@Component({
  selector: 'tm-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent extends DestroyMixin(BaseObject) implements OnInit {
  @Input() task!: TaskB;
  private dialogRef?: MatDialogRef<EditCardDialogComponent, boolean>;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
  }

  deleteTask(): void {
    this.taskService.deleteTask(this.task).pipe(takeUntil(this.destroyed$)).subscribe();
  }

  editTask() {
    this.dialogRef = this.dialog.open(EditCardDialogComponent, {
      closeOnNavigation: true,
      data: this.task
    });

    this.dialogRef.afterClosed().subscribe(
    //TODO do some cool stuff here
    );
  }

  newTaskPosition($event: CdkDragMove): void {
    const element = $event.source._dragRef;
    const newPosition = element.getFreeDragPosition();
    this.task.coordinates.x = newPosition.x;
    this.task.coordinates.y = newPosition.y;
    this.taskService.taskMovesSource$.next(this.task);
  }
}
