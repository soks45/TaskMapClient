import { Injectable } from '@angular/core';
import {
  from,
  BehaviorSubject,
  Observable,
} from 'rxjs';
import { Cached, ForCurrentBoardOnly } from 'src/app/decorators/requests';
import { ModifiedHub, SignalRService } from 'src/app/services/signal-r.service';
import { TaskB, TaskBServer } from 'src/models/task-b';
import { map, tap } from 'rxjs/operators';
import { Board } from 'src/models/board';

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

export interface HasBoard {
  currentBoard?: Board;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService implements HasBoard {
  tasks$: Observable<TaskB[]>;
  currentBoard?: Board;

  private readonly taskHub: ModifiedHub;
  private tasksSource$: BehaviorSubject<TaskB[]>;

  constructor(private signalRService: SignalRService) {
    this.taskHub = this.signalRService.taskHub;
    this.tasksSource$ = new BehaviorSubject<TaskB[]>([]);
    this.tasks$ = this.tasksSource$.asObservable();

    this.taskHub.hubConnection.on(TaskMethodsClient.addTask, (taskBServer: TaskBServer) => this.addTaskClient(this.taskBClient(taskBServer)));
    this.taskHub.hubConnection.on(TaskMethodsClient.editTask, (taskBServer: TaskBServer) => this.editTaskClient(this.taskBClient(taskBServer)));
    this.taskHub.hubConnection.on(TaskMethodsClient.deleteTask, (taskBServer: TaskBServer) => this.deleteTaskClient(this.taskBClient(taskBServer)));
  }

  @Cached()
  loadTasks(board: Board): Observable<TaskB[]> {
    return from(this.taskHub.hubConnection.invoke(TaskMethodsServer.loadTasks, board.boardId))
      .pipe(
        map((tasksServer: TaskBServer[]) => tasksServer.map(task => this.taskBClient(task))),
        tap(tasks => this.loadTasksClient(board, tasks)));
  }

  @ForCurrentBoardOnly()
  addTask(task: TaskB): Observable<TaskB> {
    return from(this.taskHub.hubConnection.invoke(TaskMethodsServer.addTask, this.taskBServer(task)))
      .pipe(
        map(taskServer => this.taskBClient(taskServer)),
        tap(task => this.addTaskClient(task)));
  }

  @Cached()
  @ForCurrentBoardOnly()
  editTask(task: TaskB): Observable<TaskB> {
    return from(this.taskHub.hubConnection.invoke(TaskMethodsServer.editTask, this.taskBServer(task)))
      .pipe(
        map(taskServer => this.taskBClient(taskServer)),
        tap(task => this.editTaskClient(task)));
  }

  @Cached()
  @ForCurrentBoardOnly()
  deleteTask(task: TaskB): Observable<TaskB> {
    return from(this.taskHub.hubConnection.invoke(TaskMethodsServer.deleteTask, this.taskBServer(task)))
      .pipe(
        map(taskServer => this.taskBClient(taskServer)),
        tap(task => this.deleteTaskClient(task)));
  }

  private addTaskClient (task: TaskB): void {
    const tasks = this.tasksSource$.getValue();
    tasks.push(task);
    this.tasksSource$.next(tasks);
  }

  private editTaskClient(task: TaskB): void {
    const tasks = this.tasksSource$.getValue();
    const index = tasks.findIndex((item => item.taskId === task.taskId));
    if (index !== -1) {
      tasks[index] = task;
      this.tasksSource$.next(tasks);
    }
  }

  private deleteTaskClient(task: TaskB): void {
    const currentTasks = this.tasksSource$.getValue();
    const newTasks = currentTasks.filter(item => task.taskId !== item.taskId);
    if (currentTasks.length !== newTasks.length) {
      this.tasksSource$.next(newTasks);
    }
  }

  private loadTasksClient(board: Board, tasks: TaskB[]): void {
    this.currentBoard = board;
    this.tasksSource$.next(tasks);
  }

  private taskBClient(task: TaskBServer): TaskB {
    console.log(task)
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
