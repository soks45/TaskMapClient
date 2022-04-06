import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { TaskB, TaskBServer } from 'src/models/task-b';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Hub, SignalRService } from 'src/app/services/signal-r.service';


@Injectable({
  providedIn: 'root'
})

export class TaskService {

  private _taskHub: Hub;
  public TaskList$: BehaviorSubject<TaskB[]>;
  constructor(
    private http: HttpClient,
    private signalRService: SignalRService
  ) {
    this._taskHub = this.Hub();
    this.TaskList$ = new BehaviorSubject(Array<TaskB>());
    this.startHubConnection();
  }

  private Hub(): Hub {
    return this.signalRService.hubs[0];
  }

  private startHubConnection(): void {
    this._taskHub.startConnection();
    this._taskHub.isConnected.pipe(filter(connection =>
      connection == true
    )).subscribe(isConnected => {
      this.startListening();
    });
  }

  public switchBoard(boardId: number) {
    this._taskHub.isConnected.pipe(filter(connection =>
      connection == true
    )).subscribe(connected => {
      this.JoinBoard(boardId);
    });
    this.GetTasks(boardId);
  }

  public stopHubConnection(): void {
    this._taskHub.stopConnection();
  }

  private taskServer(task: TaskB): TaskBServer {
    return {
      taskLabel: task.taskLabel,
      userId: task.userId,
      taskId: task.taskId,
      boardId: task.boardId,
      color: task.color,
      taskText: task.taskText,
      coordinates: JSON.stringify(task.coordinates),
      createdDate: task.createdDate,
      state: task.state
    }
  }

  private taskClient(taskServer: TaskBServer): TaskB {
    return {
      taskLabel: taskServer.taskLabel,
      userId: taskServer.userId,
      taskId: taskServer.taskId,
      boardId: taskServer.boardId,
      color: taskServer.color,
      taskText: taskServer.taskText,
      coordinates: JSON.parse(taskServer.coordinates),
      createdDate: taskServer.createdDate,
      state: taskServer.state
    }
  }

  public newTaskPosition(task: TaskB): void {
    console.log('do')
    task.coordinates.x = Math.floor(task.coordinates.x);
    task.coordinates.y = Math.floor(task.coordinates.y);
    console.log('mejdu')
    console.log(task);
    console.log('posle');
    this._taskHub.hubConnection.invoke('NewTaskPosition', this.taskServer(task));
  }

  public addNewTask(task: TaskB): void {
    this._taskHub.hubConnection.invoke('AddNewTask', this.taskServer(task));
  }

  public deleteTask(task: TaskB): void {
    this._taskHub.hubConnection.invoke('DeleteTask', this.taskServer(task));
  }

  private startListening(): void {
    console.log('Listening started');
    this._taskHub.hubConnection.on('newTaskPosition', (TaskBServer: TaskBServer) => {
      const task = this.taskClient(TaskBServer);
      console.log('Listening newTaskPosition -start-');
      const newList = this.TaskList$.value;
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].taskId === task.taskId) {
          newList[i] = task;
        }
      }
      this.TaskList$.next(newList);
      console.log('Listening newTaskPosition -end-');
    });
    this._taskHub.hubConnection.on('newTask', (TaskBServer: TaskBServer) => {
      const task = this.taskClient(TaskBServer);
      console.log('Listening newTask -start-');
      const newList = this.TaskList$.value;
      newList.push(task);
      this.TaskList$.next(newList);
      console.log('Listening newTask -end-');
    });
    this._taskHub.hubConnection.on('deleteTask', (TaskBServer: TaskBServer) => {
      const task = this.taskClient(TaskBServer);
      console.log('Listening deleteTask -start-');
      let newList = this.TaskList$.value;
      this.TaskList$.value.findIndex((currentTask, index) => {
        if (currentTask.taskId === task.taskId) {
          newList.splice(index, 1);
        }
      });
      console.log(this.TaskList$.value);
      console.log(newList);
      this.TaskList$.next(newList);
      console.log('Listening deleteTask -end-');
    });
  }

  private JoinBoard(boardId: number): void {
    this._taskHub.hubConnection.invoke('JoinBoard', boardId);
  }

  private GetTasks(boardId: number): void {
    const options = {
      params: {
        boardId
      },
    }
    this.http.get<TaskB[]>(`${environment.apiUrl}/Task`, options).subscribe(
      (response) => {
        this.TaskList$.next(response);
      }
    );
  }
}
