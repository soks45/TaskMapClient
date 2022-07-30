import { Component, Input, OnInit } from '@angular/core';
import { TaskB } from 'src/models/task-b';
import { CdkDragMove } from "@angular/cdk/drag-drop";
import {
  asyncScheduler, Subject, throttleTime
} from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import { TaskCreateDialogComponent } from "src/app/ui/board/task-create-dialog/task-create-dialog.component";
import { BoardService } from 'src/app/services/board.service';


@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})

export class TaskCardComponent /*implements OnInit*/ {
  /*@Input() task!: TaskB;

  private _dragEvents$: Subject<TaskB>;

  constructor(
    private boardService: BoardService,
    private dialog: MatDialog,
  ) {
    this._dragEvents$ = new Subject<TaskB>();
  }

  ngOnInit(): void {
    this._dragEvents$
        .pipe(
          throttleTime(17, asyncScheduler, { leading: true, trailing: true })
        )
        .subscribe(event => {
          this.onDnD(event);
        });
  }

  currentCoords(): void {
    console.log(this.task.coordinates);
  }

  onDnD(task: TaskB): void {
    this.boardService.editTask(task);
  }

  DnD($event: CdkDragMove): void {
    const element = $event.source._dragRef;
    const newPosition = element.getFreeDragPosition();
    this.task.coordinates.x = newPosition.x;
    this.task.coordinates.y = newPosition.y;
    this._dragEvents$.next(this.task);
  }

  editTask() {
    const dialog = this.dialog.open(TaskCreateDialogComponent, {
      panelClass: 'std-dialog-panel',
      backdropClass: 'std-dialog-backdrop231',
      disableClose: true,
      closeOnNavigation: true,
      data: {
        template: this.task
      },
    });
  }

  deleteTask() {
    this.boardService.deleteTask(this.task);
  }*/
}
