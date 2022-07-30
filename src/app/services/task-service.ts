import { Injectable } from '@angular/core';
import { ModifiedHub, SignalRService } from './signal-r.service';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { TaskB, TaskBServer } from '../../models/task-b';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly taskHub: ModifiedHub;

  constructor(
    private signalRService: SignalRService,
    private http: HttpClient
    ) {
    this.taskHub = this.signalRService.taskHub;
  }

  addTask(task: TaskB): Observable<void> {
    return from(this.taskHub.hubConnection.invoke('AddNewTask', this.taskBServer(task)));
  }

  deleteTask(task: TaskB): Observable<void> {
    return from(this.taskHub.hubConnection.invoke('DeleteTask', this.taskBServer(task)));
  }

  getTasks(boardId: number): Observable<TaskB[]> {
    const options = {
      params: {
        boardId
      },
    }
    return this.http.get<TaskBServer[]>(`${environment.apiUrl}/Task`, options)
      .pipe(map(taskServer => taskServer.map(task => this.taskBClient(task))));
  }

  editTask(task: TaskB): Observable<void> {
    return from(this.taskHub.hubConnection.invoke('NewTaskPosition', this.taskBServer(task)));
  }

  private taskBClient(task: TaskBServer): TaskB {
      return <TaskB> {
        ...task,
        coordinates: JSON.parse(task.coordinates)
      };
  }

  private taskBServer(task: TaskB): TaskBServer {
    task.coordinates.x = Math.floor(task.coordinates.x);
    task.coordinates.y = Math.floor(task.coordinates.y);
    return <TaskBServer> {
      ...task,
      coordinates: JSON.stringify(task.coordinates)
    }
  }
}
