import { Component, OnInit } from '@angular/core';
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
    this.signalRService.broadcastChartData(JSON.stringify(event.pointerPosition));
    console.log(event);
    console.log(event.distance);
  }

  changePosition(posDelta: ChartModel): void {
    this.dragPosition = {x: posDelta.x, y: posDelta.y};
  }

}
