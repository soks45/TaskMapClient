import {Component, ElementRef, OnInit, } from '@angular/core';
import { SignalRService } from 'src/app/services/signal-r.service';
import { ChartModel } from 'src/models/chart-model';


@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  dragPosition = {x: 0, y: 0};

  constructor(private signalRService: SignalRService) { }

  ngOnInit(): void {
    this.signalRService.data$.subscribe((data) => {
      const pos = JSON.parse(data);
      this.changePosition(pos);
    });
    this.signalRService.addTransferChartDataListener();
  }

  onDnD(event: any): void {
    let element = event.source.getRootElement();
    let boundingClientRect = element.getBoundingClientRect();
    let parentPosition = this.getPosition(element);

    const delta = {
      x: (boundingClientRect.x - parentPosition.left),
      y: (boundingClientRect.y - parentPosition.top)
    }
    this.signalRService.broadcastChartData(JSON.stringify(delta));
  }

  changePosition(coords: ChartModel): void {
    this.dragPosition = {x: coords.x, y: coords.y};
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
