import { Injectable } from '@angular/core';
import { Observable, Subject, throttleTime } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Cached } from 'src/app/decorators/cached';
import { TaskHubService } from 'src/app/services/task-hub.service';
import { TaskB, TaskBServer } from 'src/models/task-b';

enum TaskMethodsClient {
  addTask = 'newTask',
  editTask = 'editTask',
  deleteTask = 'deleteTask'
}

enum TaskMethodsServer {
  addTask = 'AddTask',
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

  constructor(private signalRService: TaskHubService) {
    this.taskMovesSource$ = new Subject<TaskB>();

    this.signalRService.on(TaskMethodsClient.addTask, (taskBServer: TaskBServer) => this.addTaskClient(this.taskBClient(taskBServer)));
    this.signalRService.on(TaskMethodsClient.editTask, (taskBServer: TaskBServer) => this.editTaskClient(this.taskBClient(taskBServer)));
    this.signalRService.on(TaskMethodsClient.deleteTask, (taskBServer: TaskBServer) => this.deleteTaskClient(this.taskBClient(taskBServer)));

    this.taskMovesSource$.pipe(throttleTime(15))
      .subscribe(task => this.moveTask(task));
  }

  @Cached()
  loadTasks(boardId: number): Observable<TaskB[]> {
    return this.signalRService.safeInvoke<TaskBServer[]>(TaskMethodsServer.loadTasks, boardId)
      .pipe(
        map((tasksServer: TaskBServer[]) => tasksServer.map(task => this.taskBClient(task))),
        tap(tasks => this.loadTasksClient(tasks)));
  }

  @Cached()
  addTask(task: TaskB): Observable<TaskB> {
    return this.signalRService.safeInvoke<TaskBServer>(TaskMethodsServer.addTask, this.taskBServer(task))
      .pipe(
        map(taskServer => this.taskBClient(taskServer)),
        tap(task => this.addTaskClient(task)));
  }

  @Cached()
  editTask(task: TaskB): Observable<TaskB> {
    return this.signalRService.safeInvoke<TaskBServer>(TaskMethodsServer.editTask, this.taskBServer(task))
      .pipe(
        map(taskServer => this.taskBClient(taskServer)),
        tap(task => this.editTaskClient(task)));
  }

  @Cached()
  deleteTask(task: TaskB): Observable<boolean> {
    return this.signalRService.safeInvoke<boolean>(TaskMethodsServer.deleteTask, this.taskBServer(task))
      .pipe(tap(() => this.deleteTaskClient(task)));
  }

  private moveTask(task: TaskB): void {
    this.signalRService.safeInvoke(TaskMethodsServer.editTask, this.taskBServer(task)).subscribe();
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
      color: 'red', // TODO remove this after error fix on server
      coordinates: JSON.stringify(task.coordinates)
    }
  }
}
