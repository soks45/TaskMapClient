import { Component, Input, OnInit } from '@angular/core';
import { ChartModel } from 'src/models/chart-model';
import { TaskService } from 'src/app/services/task.service';
import { TaskB } from 'src/models/task-b';


@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  // @ts-ignore
  @Input() card: TaskB;

  constructor(private taskService: TaskService) {

  }

  ngOnInit(): void {

  }


  onDnD(event: any): void {
    let element = event.source.getRootElement();
    let boundingClientRect = element.getBoundingClientRect();
    let parentPosition = this.getPosition(element);

    const delta: ChartModel = {
      x: (boundingClientRect.x - parentPosition.left),
      y: (boundingClientRect.y - parentPosition.top)
    }
    this.card.coordinates = delta;
    this.taskService.newTaskPosition(this.card);

  }

  getPosition(el: any) {
    let x = 0;
    let y = 0;
    while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: y, left: x };
  }
}
