import {Component, Input, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { TaskB } from 'src/models/task-b';
import { CdkDragMove } from "@angular/cdk/drag-drop";
import {
  Subject, throttleTime,
} from "rxjs";


@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  @Input() task!: TaskB;

  private _dragEvents$: Subject<TaskB>;

  constructor(private taskService: TaskService) {
    this._dragEvents$ = new Subject<any>();

  }

  ngOnInit(): void {
    this._dragEvents$
      .pipe(
        throttleTime(20)
      )
      .subscribe(event => {
        this.onDnD(event);
      });
  }

  currentCoords(): void {
    console.log(this.task.coordinates);
  }

  onDnD(task: TaskB): void {
    this.taskService.newTaskPosition(task);
  }

  DnD($event: CdkDragMove): void {
    const element = $event.source._dragRef;
    const newPosition = element.getFreeDragPosition();
    this.task.coordinates.x = newPosition.x;
    this.task.coordinates.y = newPosition.y;
    this._dragEvents$.next(this.task);
  }
}
