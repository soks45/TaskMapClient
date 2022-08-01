import { Injectable } from '@angular/core';
import { ForCurrentBoardOnly } from 'src/app/decorators/for-current-board-only';
import {
  from,
  BehaviorSubject,
  Observable,
} from 'rxjs';
import { ConvertData, LoadData } from 'src/app/decorators/requests';
import { ModifiedHub, SignalRService } from 'src/app/services/signal-r.service';
import { TaskB, TaskBServer } from 'src/models/task-b';
import { map, tap } from 'rxjs/operators';
import { Board } from 'src/models/board';

enum TaskMethodsServer {
  addTask = 'AddNewTask',
  editTask = 'newTaskPosition',
  deleteTask = 'DeleteTask',
  loadTasks = 'JoinBoard'
}

enum TaskMethodsClient {
  addTask = 'newTask',
  editTask = 'editTask',
  deleteTask = 'deleteTask'
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

  loadTasks(board: Board): Observable<TaskB[]> {
    return from(this.taskHub.hubConnection.invoke(TaskMethodsServer.loadTasks, board.boardId))
      .pipe(
        map((tasksServer: TaskBServer[]) => tasksServer.map(task => this.taskBClient(task))),
        tap(tasks => this.loadTasksClient(board, tasks)));
  }

  @LoadData('addTaskClient')
  @ConvertData('taskBClient')
  @ForCurrentBoardOnly()
  addTask(task: TaskB): Observable<TaskB> {
    return from(this.taskHub.hubConnection.invoke(TaskMethodsServer.addTask, this.taskBServer(task)));
  }

  @LoadData('editTaskClient')
  @ConvertData('taskBClient')
  @ForCurrentBoardOnly()
  editTask(task: TaskB): Observable<TaskB> {
    return from(this.taskHub.hubConnection.invoke(TaskMethodsServer.editTask, this.taskBServer(task)));
  }

  @LoadData('deleteTaskClient')
  @ConvertData('taskBClient')
  @ForCurrentBoardOnly()
  deleteTask(task: TaskB): Observable<TaskB> {
    return from(this.taskHub.hubConnection.invoke(TaskMethodsServer.deleteTask, this.taskBServer(task)))
      .pipe(map(task => this.taskBClient(task)));
  }

  @ForCurrentBoardOnly()
  private addTaskClient (task: TaskB): void {
    const tasks = this.tasksSource$.getValue();
    tasks.push(task);
    this.tasksSource$.next(tasks);
  }

  @ForCurrentBoardOnly()
  private editTaskClient(task: TaskB): void {
    const tasks = this.tasksSource$.getValue();
    const index = tasks.findIndex((item => item.taskId === task.taskId));
    if (index !== -1) {
      tasks[index] = task;
      this.tasksSource$.next(tasks);
    }
  }

  @ForCurrentBoardOnly()
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
    return <TaskB> {
      ...task,
      coordinates: JSON.parse(task.coordinates)
    };
  }

  private taskBServer(task: TaskB): TaskBServer {
    [task.coordinates.x, task.coordinates.y] = [Math.floor(task.coordinates.x), Math.floor(task.coordinates.y)];
    return <TaskBServer> {
      ...task,
      coordinates: JSON.stringify(task.coordinates)
    }
  }
}
