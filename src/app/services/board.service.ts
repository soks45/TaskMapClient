import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Board } from 'src/models/board';
import { environment } from 'src/environments/environment';
import { TaskB, TaskBServer } from 'src/models/task-b';
import { AuthService } from 'src/app/core';
import { Hub, SignalRService } from 'src/app/services/signal-r.service';
import { HubConnectionState } from '@microsoft/signalr';
import { NavigationEnd, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class BoardService implements OnDestroy {

  private _currentBoardId$: Subject<number> = new Subject<number>();
  private _userBoards$: BehaviorSubject<Board[]> = new BehaviorSubject<Board[]>([]);
  private _TaskList$: BehaviorSubject<TaskB[]> = new BehaviorSubject<TaskB[]>([]);
  private readonly ngUnsubscribe$: Subject<void> = new Subject<void>();
  private readonly ngUnsubscribeIfNotBoardPage$: Subject<void> = new Subject<void>();

  events: Subject<MouseEvent> = new Subject<MouseEvent>();
  private _taskHub: Hub = this.signalRService.hubs[0];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private signalRService: SignalRService,
    private router: Router
  ) {
    this.authService.user$.pipe(filter(user => user !== null), takeUntil(this.ngUnsubscribe$)).subscribe(() => this.startHubConnection());
    this.authService.user$.pipe(filter(user => user === null), takeUntil(this.ngUnsubscribe$)).subscribe(() => this.stopHubConnection());

    this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          // @ts-ignore
          filter(event => event.url !== '/board-page'),
          takeUntil(this.ngUnsubscribe$)
        )
        .subscribe(() => this.ngUnsubscribeIfNotBoardPage$.next());

    this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          // @ts-ignore
          filter(event => event.url === '/board-page'),
          takeUntil(this.ngUnsubscribe$)
        )
        .subscribe(() => {
          this.getBoard().pipe(takeUntil(this.ngUnsubscribeIfNotBoardPage$)).subscribe({
            next: (value) => {
              console.log('-get-boards-: ', value);
              this._userBoards$.next(value);
            },
            error: (err) => console.error(err),
            complete: () => {
              console.log('getBoard completed');
              this.getTasks(this._userBoards$.value[0].boardId).pipe(takeUntil(this.ngUnsubscribeIfNotBoardPage$)).subscribe({
                  next: (response) => {
                    console.log('-get-tasks-: ', response);
                    const newList: TaskB[] = [];
                    response.forEach(value => {
                      newList.push(this.taskClient(value))
                    });
                    this._TaskList$.next(newList);
                  },
                  error: e => console.error(e),
                  complete: () => {
                    console.log('getTasks completed');
                    this.startListening();
                  }
                }
              );
            }
          });
        });

    this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          // @ts-ignore
          filter(event => event.url !== '/board-page'),
          takeUntil(this.ngUnsubscribe$)
        )
        .subscribe((res) => this.stopListening());
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.unsubscribe();
    this.ngUnsubscribeIfNotBoardPage$.unsubscribe();
  }

  public editTask(task: TaskB): void {
    task.coordinates.x = Math.floor(task.coordinates.x);
    task.coordinates.y = Math.floor(task.coordinates.y);
    this._taskHub.HubConnection.invoke('NewTaskPosition', this.taskServer(task));
  }

  public switchBoard(boardId: number): void {
    this._taskHub.HubConnection.invoke('JoinBoard', boardId).catch(e => console.error(e));
  }

  public addNewTask(task: TaskB): void {
    this._taskHub.HubConnection.invoke('AddNewTask', this.taskServer(task)).catch(e => console.error(e));
  }

  public deleteTask(task: TaskB): void {
    this._taskHub.HubConnection.invoke('DeleteTask', this.taskServer(task)).catch(e => console.error(e));
  }

  private startHubConnection(): void {
    this._taskHub.startConnection();
  }

  private stopHubConnection(): void {
    this.stopListening();
    this._taskHub.stopConnection();
  }

  private stopListening() {
    console.log('-Listening stopped-');
    this._taskHub.HubConnection.off('newTaskPosition');
    this._taskHub.HubConnection.off('newTask');
    this._taskHub.HubConnection.off('deleteTask');
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

  private startListening(): void {
    console.log('Listening started');
    this._taskHub.HubConnection.on('newTaskPosition', (TaskBServer: TaskBServer) => {
      const task = this.taskClient(TaskBServer);
      console.log('Listening newTaskPosition -start-');
      const newList = this._TaskList$.value;
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].taskId === task.taskId) {
          newList[i] = task;
        }
      }
      this._TaskList$.next(newList);
      console.log('Listening newTaskPosition -end-');
    });
    this._taskHub.HubConnection.on('newTask', (TaskBServer: TaskBServer) => {
      const task = this.taskClient(TaskBServer);
      console.log('Listening newTask -start-');
      const newList = this._TaskList$.value;
      newList.push(task);
      this._TaskList$.next(newList);
      console.log('Listening newTask -end-');
    });
    this._taskHub.HubConnection.on('deleteTask', (TaskBServer: TaskBServer) => {
      const task = this.taskClient(TaskBServer);
      console.log('Listening deleteTask -start-');
      let newList = this._TaskList$.value;
      this._TaskList$.value.findIndex((currentTask, index) => {
        if (currentTask.taskId === task.taskId) {
          newList.splice(index, 1);
        }
      });
      console.log(this._TaskList$.value);
      console.log(newList);
      this._TaskList$.next(newList);
      console.log('Listening deleteTask -end-');
    });
  }

  private getTasks(boardId: number): Observable<TaskBServer[]> {
    const options = {
      params: {
        boardId
      },
    }
    return this.http.get<TaskBServer[]>(`${environment.apiUrl}/Task`, options);
  }



  get CurrentBoardId$(): Observable<number> {
    return this._currentBoardId$.asObservable();
  }

  get TaskList$(): Observable<TaskB[]> {
    return this._TaskList$.asObservable();
  }

  getBoard(): Observable<Board[]> {
    return this.http.get<Board[]>(`${environment.apiUrl}/Board/get-boards`, { withCredentials: true });
  }

  deleteBoard(boardId: number): void {
    const options = {
      params: {
        boardId
      },
      withCredentials: true
    }

    this.http.get<void>(`${environment.apiUrl}/Board/delete-board`, options).subscribe({
      next: () => {
        const index = this._userBoards$.value.findIndex(board => board.boardId === boardId);
        this._userBoards$.next(this._userBoards$.value.splice(index, 1));
      },
      error: (e) => {
        console.log(e)
      }
    });
  }

  addBoard(board: Board): void {
    const newBoard = JSON.stringify(board);
    const options = {
      params: {
        newBoard
      },
      withCredentials: true
    };
    this.http.post<Board>(`${environment.apiUrl}/Board/add-board`, options).subscribe({
      next: () => {
        let boards = this._userBoards$.value;
        boards.push(board);
        this._userBoards$.next(boards);
      },
      error: (e) => console.error(e)
    });
  }

  editBoard(board: Board): void {
    const newBoard = JSON.stringify(board);
    const options = {
      params: {
        newBoard
      },
      withCredentials: true
    };
    this.http.post<Board>(`${environment.apiUrl}/Board/add-board`, options).subscribe({
      next: () => {
        let boards = this._userBoards$.value;
        boards[boards.findIndex(b => b.boardId === board.boardId)] = board;
        this._userBoards$.next(boards);
      },
      error: (e) => console.error(e)
    });
  }
}
