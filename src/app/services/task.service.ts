import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { TaskB } from 'src/models/task-b';
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
    this.JoinBoard(boardId);
    this.GetTasks(boardId);
  }

  public stopHubConnection(): void {
    this._taskHub.stopConnection();
  }

  public newTaskPosition(task: TaskB): void {
    this._taskHub.hubConnection.invoke('NewTaskPosition', task);
  }

  private startListening(): void {
    this._taskHub.hubConnection.on('newTaskPosition', (data: string) => {
      const task = JSON.parse(data);
      const newList = this.TaskList$.value;
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].taskId === task.taskId) {
          newList[i] = task;
        }
      }
      this.TaskList$.next(newList);
    });
    this._taskHub.hubConnection.on('newTask', (data: string) => {
      const task = JSON.parse(data);
      const newList = this.TaskList$.value;
      newList.push(task)
      this.TaskList$.next(newList);
    });
    this._taskHub.hubConnection.on('deleteTask', (data: string) => {
      const task = JSON.parse(data);
      const newList = this.TaskList$.value;
      newList.splice(this.TaskList$.value.findIndex(task), 1);
      this.TaskList$.next(newList);
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
