import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { TaskB } from 'src/models/task-b';
import { ChartModel } from "src/models/chart-model";
import { MatDialog } from '@angular/material/dialog';
import { TaskCreateDialogComponent } from "src/app/ui/board/task-create-dialog/task-create-dialog.component";

@Component({
  selector: 'app-dnd-field',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input() boardId: number = 0;

  taskList: TaskB[];

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
  ) {
    this.taskList = [];
  }

  ngOnInit(): void {
    this.taskService.switchBoard(this.boardId);
    this.taskService.TaskList$.subscribe(res => {
      console.log('some changes', res);
      this.taskList = res;
    });
  }

  // addNewTask(): void {
  //   if(this.x && this.y && this.taskId) {
  //     const task: TaskB = {
  //       userId: 1,
  //       taskId: parseInt(this.taskId.nativeElement.value),
  //       coordinates: {
  //         x: parseInt(this.x.nativeElement.value),
  //         y: parseInt(this.y.nativeElement.value)
  //       },
  //       taskLabel: '',
  //       taskText: '',
  //       state: 0,
  //       boardId: this.boardId,
  //       color: '',
  //       createdDate: '123',
  //     }
  //     console.log(task);
  //     this.taskService.addNewTask(task);
  //   }
  // }

  getElementCoordinates(el: ElementRef): ChartModel {
    return {
      x: el.nativeElement.offsetLeft,
      y: el.nativeElement.offsetTop
    }
  }

  createTask(): void {
    const dialog = this.dialog.open(TaskCreateDialogComponent, {
      panelClass: 'std-dialog-panel',
      backdropClass: 'std-dialog-backdrop231',
      disableClose: true,
      closeOnNavigation: true,
      data: {
        template: <TaskB> {}
      },
    });

    dialog.afterClosed().subscribe((response) => {
      if (response) {
       console.log(response);
      }
    });
  }
}
