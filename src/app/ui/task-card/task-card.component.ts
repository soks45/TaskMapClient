import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { TaskB } from 'src/models/task-b';
import { CdkDragMove } from "@angular/cdk/drag-drop";


@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  @Input() task!: TaskB;


  constructor(private taskService: TaskService) {

  }

  ngOnInit(): void {  }

  currentCoords(): void {
    console.log(this.task.coordinates);
  }

  onDnD($event: CdkDragMove): void {
    const element = $event.source._dragRef;
    const newPosition = element.getFreeDragPosition();
    // this.task.coordinates = newPosition;
    this.task.coordinates.x = newPosition.x;
    this.task.coordinates.y = newPosition.y;
    this.taskService.newTaskPosition(this.task);
  }
}
