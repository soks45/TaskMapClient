import { Injectable } from '@angular/core';
import { forCurrentBoardOnly } from 'src/app/decorators/for-current-board-only';
import { HttpClient } from '@angular/common/http';
import {
  asyncScheduler,
  BehaviorSubject,
  distinctUntilKeyChanged,
  from,
  Observable,
  throttleTime
} from 'rxjs';
import { BoardService } from 'src/app/services/board.service';
import { ModifiedHub, SignalRService } from 'src/app/services/signal-r.service';
import { TaskB, TaskBServer } from 'src/models/task-b';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
import { Board } from 'src/models/board';


enum TaskMethodsServer {
  addTask = 'AddNewTask',
  editTask = 'newTaskPosition',
  deleteTask = 'DeleteTask'
}

enum TaskMethodsClient {
  addTask = 'newTask',
  editTask = 'editTask',
  deleteTask = 'deleteTask'
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasks$: Observable<TaskB[]>

  private readonly taskHub: ModifiedHub;
  private tasksSource$: BehaviorSubject<TaskB[]>;
  private currentBoard$: Observable<Board>;
  private currentBoard?: Board;

  constructor(
    private signalRService: SignalRService,
    private http: HttpClient,
    private boardService: BoardService
    ) {
    this.taskHub = this.signalRService.taskHub;

    this.tasksSource$ = new BehaviorSubject<TaskB[]>([]);
    this.tasks$ = this.tasksSource$.asObservable();

    this.currentBoard$ = this.boardService.currentBoard$;
    this.currentBoard$
      .pipe(
        distinctUntilKeyChanged('boardId'),
        throttleTime(1200, asyncScheduler, { leading: true, trailing: true }))
      .subscribe(board => {
        this.currentBoard = board;
        this.loadTasks(board);
      });

    this.taskHub.hubConnection.on(TaskMethodsClient.addTask, (taskBServer: TaskBServer) => this.addTaskClient(this.taskBClient(taskBServer)));
    this.taskHub.hubConnection.on(TaskMethodsClient.editTask, (taskBServer: TaskBServer) => this.editTaskClient(this.taskBClient(taskBServer)));
    this.taskHub.hubConnection.on(TaskMethodsClient.deleteTask, (taskBServer: TaskBServer) => this.deleteTaskClient(this.taskBClient(taskBServer)));
  }

  getTasks(boardId: number): Observable<TaskB[]> {
    const options = { params: { boardId } }
    return this.http.get<TaskBServer[]>(`${environment.apiUrl}/Task`, options)
      .pipe(map(tasksServer => tasksServer.map(task => this.taskBClient(task))));
  }

  @forCurrentBoardOnly()
  addTask(task: TaskB): Observable<TaskB> {
    return from(this.taskHub.hubConnection.invoke(TaskMethodsServer.addTask, this.taskBServer(task)))
      .pipe(
        map(task => this.taskBClient(task)),
        tap(task => this.addTaskClient(task)));
  }

  @forCurrentBoardOnly()
  editTask(task: TaskB): Observable<TaskB> {
    return from(this.taskHub.hubConnection.invoke(TaskMethodsServer.editTask, this.taskBServer(task)))
      .pipe(
        map(task => this.taskBClient(task)),
        tap(task => this.editTaskClient(task)));
  }

  @forCurrentBoardOnly()
  deleteTask(task: TaskB): Observable<TaskB> {
    return from(this.taskHub.hubConnection.invoke(TaskMethodsServer.deleteTask, this.taskBServer(task)))
      .pipe(
        map(task => this.taskBClient(task)),
        tap(task => this.deleteTaskClient(task)));
  }

  private loadTasks(board: Board): void {
    this.getTasks(board.boardId).subscribe(tasks => this.tasksSource$.next(tasks));
  }

  @forCurrentBoardOnly()
  private addTaskClient (task: TaskB): void {
    const tasks = this.tasksSource$.getValue();
    tasks.push(task);
    this.tasksSource$.next(tasks);
  }

  @forCurrentBoardOnly()
  private editTaskClient(task: TaskB): void {
    let needReload = false;
    const tasks = this.tasksSource$.getValue();
    tasks.forEach(item => {
      if (item.taskId === task.taskId) {
        item = task;
        needReload = true;
      }
    });

    if (needReload) {
      this.tasksSource$.next(tasks);
    }
  }

  @forCurrentBoardOnly()
  private deleteTaskClient(task: TaskB): void {
    const currentTasks = this.tasksSource$.getValue();
    const newTasks = currentTasks.filter(item => task.taskId !== item.taskId);

    if (currentTasks.length !== newTasks.length) {
      this.tasksSource$.next(newTasks);
    }
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
