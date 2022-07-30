import { Component } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { TaskB } from '../../../models/task-b';
import { SignalRService } from '../../services/signal-r.service';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  constructor(private taskService: TaskService, private signalR: SignalRService) {
  }

  create(): void {
    this.signalR.taskHub.hubConnection.invoke('JoinBoard', 3)
      .then(() => {
/*        this.taskService.addTask({
          coordinates: {
            y: 1,
            x: 1
          },
          boardId: 3,
          createdDate: '',
          color: 'red',
          state: 1,
          taskId: 0,
          userId: 3,
          taskText: 'q',
          taskLabel: 'daw'
        })*/
        this.taskService.getTasks(3).subscribe(res => console.log(res));
      })
  }
}
