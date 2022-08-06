import { Injectable } from '@angular/core';
import { HubConnectionState } from '@microsoft/signalr';
import { Observable, Subject, throttleTime } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Cached } from 'src/app/decorators/cached';
import { ModifiedHub, SignalRService } from 'src/app/services/signal-r.service';
import { TaskB, TaskBServer } from 'src/models/task-b';

enum TaskMethodsClient {
  addTask = 'newTask',
  editTask = 'editTask',
  deleteTask = 'deleteTask'
}

enum TaskMethodsServer {
  addTask = 'AddNewTask',
  editTask = 'EditTask',
  deleteTask = 'DeleteTask',
  loadTasks = 'JoinBoard'
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  readonly tasks: TaskB[] = [];
  readonly taskMovesSource$: Subject<TaskB>;

  private readonly taskHub: ModifiedHub;

  constructor(private signalRService: SignalRService) {
    this.taskHub = this.signalRService.taskHub;
    this.taskMovesSource$ = new Subject<TaskB>();

    this.taskHub.hubConnection.on(TaskMethodsClient.addTask, (taskBServer: TaskBServer) => this.addTaskClient(this.taskBClient(taskBServer)));
    this.taskHub.hubConnection.on(TaskMethodsClient.editTask, (taskBServer: TaskBServer) => this.editTaskClient(this.taskBClient(taskBServer)));
    this.taskHub.hubConnection.on(TaskMethodsClient.deleteTask, (taskBServer: TaskBServer) => this.deleteTaskClient(this.taskBClient(taskBServer)));

    this.taskMovesSource$.pipe(throttleTime(15))
      .subscribe(task => this.moveTask(task));
  }

  @Cached()
  loadTasks(boardId: number): Observable<TaskB[]> {
    return this.signalRService.taskHub.safeInvoke<TaskBServer[]>(TaskMethodsServer.loadTasks, boardId)
      .pipe(
        map((tasksServer: TaskBServer[]) => tasksServer.map(task => this.taskBClient(task))),
        tap(tasks => this.loadTasksClient(tasks)));
  }

  addTask(task: TaskB): Observable<TaskB> {
    return this.signalRService.taskHub.safeInvoke<TaskBServer>(TaskMethodsServer.addTask, this.taskBServer(task))
      .pipe(
        map(taskServer => this.taskBClient(taskServer)),
        tap(task => this.addTaskClient(task)));
  }

  @Cached()
  editTask(task: TaskB): Observable<TaskB> {
    return this.signalRService.taskHub.safeInvoke<TaskBServer>(TaskMethodsServer.editTask, this.taskBServer(task))
      .pipe(
        map(taskServer => this.taskBClient(taskServer)),
        tap(task => this.editTaskClient(task)));
  }

  @Cached()
  deleteTask(task: TaskB): Observable<TaskB> {
    return this.signalRService.taskHub.safeInvoke<TaskBServer>(TaskMethodsServer.deleteTask, this.taskBServer(task))
      .pipe(
        map(taskServer => this.taskBClient(taskServer)),
        tap(task => this.deleteTaskClient(task)));
  }

  private moveTask(task: TaskB): void {
    if (this.signalRService.taskHub.hubConnection.state !== HubConnectionState.Connected) {
      return;
    }
    this.signalRService.taskHub.hubConnection.invoke(TaskMethodsServer.editTask, this.taskBServer(task));
  }

  private addTaskClient (task: TaskB): void {
    this.tasks.push(task);
  }

  private editTaskClient(task: TaskB): void {
    const index = this.tasks.findIndex((item => item.taskId === task.taskId));
    if (index !== -1) {
      this.tasks[index] = task;
    }
  }

  private deleteTaskClient(task: TaskB): void {
    const index = this.tasks.findIndex((item => item.taskId === task.taskId));
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }

  private loadTasksClient(tasks: TaskB[]): void {
    this.tasks.splice(0, this.tasks.length);
    tasks.forEach(task => this.tasks.push(task));
  }

  private taskBClient(task: TaskBServer): TaskB {
    return <TaskB> {
      ...task,
      coordinates: JSON.parse(task.coordinates)
    };
  }

  private taskBServer(task: TaskB): TaskBServer {
    [task.coordinates.x, task.coordinates.y] = [Math.abs(Math.floor(task.coordinates.x)), Math.abs(Math.floor(task.coordinates.y))];
    return <TaskBServer> {
      ...task,
      coordinates: JSON.stringify(task.coordinates)
    }
  }
}
