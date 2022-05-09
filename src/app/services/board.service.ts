import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, Observable, pairwise, Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Board } from 'src/models/board';
import { environment } from 'src/environments/environment';
import { TaskB, TaskBServer } from 'src/models/task-b';
import { AuthService } from 'src/app/core';
import { Hub, SignalRService } from 'src/app/services/signal-r.service';
import { HubConnectionState } from '@microsoft/signalr';
import { NavigationEnd, Router } from '@angular/router';
import { User } from 'src/models/user';
import { NGXLogger } from 'ngx-logger';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class BoardService implements OnDestroy {
  private _taskHub: Hub = this.signalRService.taskHub;

  private _currentBoardId$: Subject<number> = new Subject<number>();
  private _userBoards$: BehaviorSubject<Board[]> = new BehaviorSubject<Board[]>([]);
  private _taskList$: BehaviorSubject<TaskB[]> = new BehaviorSubject<TaskB[]>([]);
  private _currentBoardId: number | null = null;
  private _userBoards: Board[] = [];
  private _taskList: TaskB[] = [];
  private _currentRoute: string = '/main-page';


  private readonly ngUnsubscribe$: Subject<void> = new Subject<void>();
  private readonly ngUnsubscribeIfNotBoardPage$: Subject<void> = new Subject<void>();
  private readonly ngUnsubscribeIfSignalRNotConnected$: Subject<void> = new Subject<void>();
  private readonly loginEvents$: Observable<User | null> = this.authService.user$.
  pipe(
    filter(user => user !== null),
    takeUntil(this.ngUnsubscribe$));
  private readonly logoutEvents$: Observable<User | null> = this.authService.user$.
  pipe(
    pairwise(),
    filter(users => users[0] !== null),
    filter(users => users[1] === null),
    map(users => users[1]),
    takeUntil(this.ngUnsubscribe$));
  // @ts-ignore
  private readonly redirectionsOnBoardPage$: Observable<Event_2> = this.router.events.
  pipe(
    filter(event => event instanceof NavigationEnd),
    // @ts-ignore
    filter(event => event.urlAfterRedirects === '/board-page'),
    takeUntil(this.ngUnsubscribe$));
  // @ts-ignore
  private readonly redirectionsFromBoardPage$: Observable<Event_2> = this.router.events.
  pipe(
    filter(event => event instanceof NavigationEnd),
    // @ts-ignore
    filter(event => event.url !== '/board-page'),
    takeUntil(this.ngUnsubscribe$));
  // @ts-ignore
  private readonly redirections$: Observable<Event_2> = this.router.events.
  pipe(
    filter(event => event instanceof NavigationEnd),
    // @ts-ignore
    takeUntil(this.ngUnsubscribe$));
  private readonly signalRConnectedEvents$: Observable<HubConnectionState> = this._taskHub.ConnectionState$.
  pipe(
    filter(state => state === HubConnectionState.Connected),
    takeUntil(this.ngUnsubscribe$));
  private readonly signalRDisconnectedEvents$: Observable<HubConnectionState> = this._taskHub.ConnectionState$.
  pipe(
    pairwise(),
    filter(pair => pair[0] === HubConnectionState.Connected),
    filter(pair => pair[1] !== HubConnectionState.Connected),
    map(pair => pair[1]),
    takeUntil(this.ngUnsubscribe$));
  private readonly currentBoardChangeEvents$: Observable<number> = this._currentBoardId$.
  pipe(
    takeUntil(this.ngUnsubscribeIfNotBoardPage$),
    takeUntil(this.ngUnsubscribeIfSignalRNotConnected$),
    takeUntil(this.ngUnsubscribe$));
  private readonly getBoardsRequest$: Observable<Board[]> = this.getBoard().
  pipe(
    takeUntil(this.ngUnsubscribeIfNotBoardPage$),
    takeUntil(this.ngUnsubscribeIfSignalRNotConnected$),
    takeUntil(this.ngUnsubscribe$));


  events: Subject<MouseEvent> = new Subject<MouseEvent>();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private signalRService: SignalRService,
    private router: Router,
    private logger: NGXLogger
  ) {
    this.dataSetup();
    this.loginLogicSetup();
    this.signalRLogicSetup();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.unsubscribe();
    this.ngUnsubscribeIfNotBoardPage$.unsubscribe();
    this.ngUnsubscribeIfSignalRNotConnected$.unsubscribe();
  }

  public editTask(task: TaskB): Promise<any> {
    task.coordinates.x = Math.floor(task.coordinates.x);
    task.coordinates.y = Math.floor(task.coordinates.y);
    return this._taskHub.HubConnection.invoke('NewTaskPosition', BoardService.taskServer(task));
  }

  public switchBoard(boardId: number): Promise<any> {
    return this._taskHub.HubConnection.invoke('JoinBoard', boardId)
      .then(() => {
        this.logger.trace('-switchboard-: ', boardId);
        this._currentBoardId = boardId;
      })
      .catch((e) => this.logger.error(e));
  }

  public addNewTask(task: TaskB): Promise<any> {
    return this._taskHub.HubConnection.invoke('AddNewTask', BoardService.taskServer(task)).catch((e) => this.logger.error(e));
  }

  public deleteTask(task: TaskB): Promise<any> {
    return this._taskHub.HubConnection.invoke('DeleteTask', BoardService.taskServer(task)).catch((e) => this.logger.error(e));
  }

  // @ts-ignore
  get CurrentRoute$(): Observable<Event_2> {
    return this.redirections$;
  }

  get CurrentBoardId$(): Observable<number> {
    return this._currentBoardId$.asObservable();
  }

  get UserBoards(): Board[] {
    return this._userBoards;
  }

  get UserBoards$(): Observable<Board[]> {
    return this._userBoards$.asObservable();
  }

  get CurrentBoardId(): number {
    if (this._currentBoardId)
      return this._currentBoardId;
    return -1;
  }

  get TaskList$(): Observable<TaskB[]> {
    return this._taskList$.asObservable();
  }

  public deleteCurrentBoard(id: number): void {
    this.switchBoard(3)
        .then(() => this.deleteBoard(id))
        .catch((e) => this.logger.error(e))
        .catch((e) => this.logger.error(e));
  }

  private dataSetup(): void {
    this.redirections$.subscribe(event => this._currentRoute = event.url);
    this._currentBoardId$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(id => {
      this.logger.trace('-current board id-', id);
      this._currentBoardId = id;
    });
    this._userBoards$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(boards => {
      this.logger.trace('-current user boards', boards);
      this._userBoards = boards;
    });
    this._taskList$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(tasks => {
      this.logger.trace('-current task list-', tasks);
      this._taskList = tasks;
    });
  }

  private loginLogicSetup(): void {
    this.loginEvents$.subscribe(() => {
      this.startHubConnection();
    });
    this.logoutEvents$.subscribe(() => {
      this.stopHubConnection();
    });
  }

  private signalRLogicSetup(): void {
    this.signalRConnectedEvents$.subscribe(() => {
      this.redirectionsOnBoardPage$.pipe(takeUntil(this.ngUnsubscribeIfSignalRNotConnected$)).subscribe(() => {
        this.loadBoardPageData();
      });
      this.redirectionsFromBoardPage$.pipe(takeUntil(this.ngUnsubscribeIfSignalRNotConnected$)).subscribe(() => {
        this.stopListening();
        this.ngUnsubscribeIfNotBoardPage$.next();
      });
    });
    this.signalRDisconnectedEvents$.subscribe(() => {
      this.ngUnsubscribeIfSignalRNotConnected$.next();
    });
  }

  private loadBoardPageData(): void {
    this.logger.trace('-subscribed!-');
    this.getBoardsRequest$.subscribe({
      next: (value) => {
        this.logger.trace('-get-boards-: ', value);
        this._userBoards$.next(value);
        this.currentBoardChangeEvents$.subscribe((id) => {
          this.logger.trace('board - ', id);
          this.loadBoardTasks(id);
        });
        this._currentBoardId$.next(value[0].boardId);
      },
      error: (e) => this.logger.error(e),
      complete: () => this.logger.trace('getBoard completed')
    });
  }

  public loadBoardTasks(id: number): void {
    this.logger.trace('-loadBoardTasks-');
    this.switchBoard(id).then(() => {
      this.logger.trace('-switchBoard completed-');
      this.getTasks(id).
      pipe(
        takeUntil(this.ngUnsubscribeIfNotBoardPage$),
        takeUntil(this.ngUnsubscribeIfSignalRNotConnected$),
        takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (response) => {
          this.logger.trace('-get-tasks-: ', response);
          this.loadTasks(response);
        },
        error: (e) => this.logger.error(e),
        complete: () => {
          this.logger.trace('getTasks completed');
          this.startListening();
        }
      });
    }).catch((e) => this.logger.error(e));
  }

  private loadTasks(tasks: TaskBServer[]): void {
    const newList: TaskB[] = [];
    tasks.forEach(value => {
      newList.push(BoardService.taskClient(value))
    });
    this._taskList$.next(newList);
  }

  private startHubConnection(): void {
    this._taskHub.startConnection();
  }

  private stopHubConnection(): void {
    this._taskHub.stopConnection();
  }

  private stopListening() {
    this.logger.trace('-Listening stopped-');
    this._taskHub.HubConnection.off('newTaskPosition');
    this._taskHub.HubConnection.off('newTask');
    this._taskHub.HubConnection.off('deleteTask');
  }

  private static taskServer(task: TaskB): TaskBServer {
    return {
      taskLabel: task.taskLabel,
      userId:  task.userId,
      taskId: task.taskId,
      boardId: task.boardId,
      color: task.color,
      taskText: task.taskText,
      coordinates: JSON.stringify(task.coordinates),
      createdDate: task.createdDate,
      state: task.state
    }
  }

  private static taskClient(taskServer: TaskBServer): TaskB {
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
    this.stopListening();
    this.logger.trace('Listening started');
    this._taskHub.HubConnection.on('newTaskPosition', (TaskBServer: TaskBServer) => {
      const task = BoardService.taskClient(TaskBServer);
      this.logger.trace('Listening newTaskPosition -start-');
      const newList = this._taskList$.value;
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].taskId === task.taskId) {
          newList[i] = task;
        }
      }
      this._taskList$.next(newList);
      this.logger.trace('Listening newTaskPosition -end-');
    });

    this._taskHub.HubConnection.on('newTask', (TaskBServer: TaskBServer) => {
      const task = BoardService.taskClient(TaskBServer);
      this.logger.trace('Listening newTask -start-');
      const newList = this._taskList$.value;
      newList.push(task);
      this._taskList$.next(newList);
      this.logger.trace('Listening newTask -end-');
    });

    this._taskHub.HubConnection.on('deleteTask', (TaskBServer: TaskBServer) => {
      const task = BoardService.taskClient(TaskBServer);
      this.logger.trace('Listening deleteTask -start-');
      let newList = this._taskList$.value;
      this._taskList$.value.findIndex((currentTask, index) => {
        if (currentTask.taskId === task.taskId) {
          newList.splice(index, 1);
        }
      });
      this.logger.trace(this._taskList$.value);
      this.logger.trace(newList);
      this._taskList$.next(newList);
      this.logger.trace('Listening deleteTask -end-');
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

  private getBoard(): Observable<Board[]> {
    return this.http.get<Board[]>(`${environment.apiUrl}/Board/get-boards`, { withCredentials: true });
  }

  private deleteBoard(boardId: number): void {
    const options = {
      params: {
        boardId
      },
    }
    this.http.get<void>(`${environment.apiUrl}/Board/delete-board`, options).subscribe({
      next: () => {
        const index = this._userBoards$.value.findIndex(board => board.boardId === boardId);
        this._userBoards$.next(this._userBoards$.value.splice(index, 1));
      },
      error: (e) => this.logger.error(e)
    });
  }

  addBoard(board: Board): void {
    const options = {
      boardId: board.boardId,
      userId: board.userId,
      boardName: board.boardName,
      createdDate: board.createdDate,
      boardDescription: board.boardDescription,
      withCredentials: true
    };
    this.http.post<number>(`${environment.apiUrl}/Board/add-board`, options).subscribe({
      next: (boardId) => {
        board.boardId = boardId;
        let boards = this._userBoards$.value;
        boards.push(board);
        this._userBoards$.next(boards);
      },
      error: (e) => this.logger.error(e)
    });
  }

  editBoard(board: Board): void {
    const options = {
      boardId: board.boardId,
      userId: board.userId,
      boardName: board.boardName,
      createdDate: board.createdDate,
      boardDescription: board.boardDescription,
      withCredentials: true
    };
    this.http.post<Board>(`${environment.apiUrl}/Board/change-board`, options).subscribe({
      next: () => {
        let boards = this._userBoards$.value;
        boards[boards.findIndex(b => b.boardId === board.boardId)] = board;
        this._userBoards$.next(boards);
      },
      error: (e) => this.logger.error(e)
    });
  }
}
