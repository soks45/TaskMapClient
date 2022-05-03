import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaskB } from 'src/models/task-b';
import { CdkDragMove } from "@angular/cdk/drag-drop";
import {
  asyncScheduler, Subject, Subscription, throttleTime
} from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import { TaskCreateDialogComponent } from "src/app/ui/board/task-create-dialog/task-create-dialog.component";


@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit, OnDestroy {
  @Input() task!: TaskB;

  private _dragEvents$: Subject<TaskB>;
  userAvatar: string = 'https://material.angular.io/assets/img/examples/shiba1.jpg';
  private subcription?: Subscription;

  constructor(
    private dialog: MatDialog,
  ) {
    this._dragEvents$ = new Subject<TaskB>();
  }

  ngOnInit(): void {
    // this.subcription = this._dragEvents$
    //    .pipe(
    //      throttleTime(17, asyncScheduler, { leading: true, trailing: true })
    //    )
    //    .subscribe(event => {
    //      this.onDnD(event);
    //    });
  }

  // currentCoords(): void {
  //   console.log(this.task.coordinates);
  // }
  //
  // onDnD(task: TaskB): void {
  //   this.taskService.newTaskPosition(task);
  // }
  //
  // DnD($event: CdkDragMove): void {
  //   const element = $event.source._dragRef;
  //   const newPosition = element.getFreeDragPosition();
  //   this.task.coordinates.x = newPosition.x;
  //   this.task.coordinates.y = newPosition.y;
  //   this._dragEvents$.next(this.task);
  // }
  //
  // editTask() {
  //   const dialog = this.dialog.open(TaskCreateDialogComponent, {
  //     panelClass: 'std-dialog-panel',
  //     backdropClass: 'std-dialog-backdrop231',
  //     disableClose: true,
  //     closeOnNavigation: true,
  //     data: {
  //       template: this.task
  //     },
  //   });
  // }
  //
  // deleteTask() {
  //   this.taskService.deleteTask(this.task);
  // }
  //
  ngOnDestroy() {
    this.subcription?.unsubscribe();
  }
}
