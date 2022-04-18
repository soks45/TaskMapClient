import {Component, Input, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { TaskB } from 'src/models/task-b';
import { CdkDragMove } from "@angular/cdk/drag-drop";
import {
  asyncScheduler, Subject, throttleTime
} from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import { TaskCreateDialogComponent } from "src/app/ui/board/task-create-dialog/task-create-dialog.component";
import { UserService } from "src/app/services/user.service";


@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  // @Input() task!: TaskB;
  //
  // private _dragEvents$: Subject<TaskB>;
  // userAvatar: string = 'https://material.angular.io/assets/img/examples/shiba1.jpg';
  //
  // constructor(
  //   private taskService: TaskService,
  //   private dialog: MatDialog,
  //   private userService: UserService,
  // ) {
  //   this._dragEvents$ = new Subject<TaskB>();
  // }

  ngOnInit(): void {
    // this._dragEvents$
    //   .pipe(
    //     throttleTime(17, asyncScheduler, { leading: true, trailing: true })
    //   )
    //   .subscribe(event => {
    //     this.onDnD(event);
    //   });
    // this.userService.users.forEach((user, index) => {
    //   if (user.userId === this.task.userId) {
    //     this.userAvatar = user.avatar;
    //   }
    // });
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
}
