import { Injectable } from '@angular/core';
import { Cached } from '@decorators/cached';
import { TaskB, TaskBServer } from '@models/task-b';
import { ConverterService } from '@services/converter.service';
import { TaskHubService } from '@services/task-hub.service';
import { Observable, Subject, throttleTime } from 'rxjs';
import { map, tap } from 'rxjs/operators';

enum TaskMethodsClient {
    addTask = 'newTask',
    editTask = 'editTask',
    deleteTask = 'deleteTask',
}

enum TaskMethodsServer {
    addTask = 'AddTask',
    editTask = 'EditTask',
    deleteTask = 'DeleteTask',
    loadTasks = 'JoinBoard',
}

@Injectable({
    providedIn: 'root',
})
export class TaskService {
    readonly tasks: TaskB[] = [];
    readonly taskMovesSource$: Subject<TaskB>;

    constructor(private signalRService: TaskHubService, private converter: ConverterService) {
        this.taskMovesSource$ = new Subject<TaskB>();

        this.signalRService.on(TaskMethodsClient.addTask, (taskBServer: TaskBServer) =>
            this.addTaskClient(this.converter.taskBClient(taskBServer))
        );
        this.signalRService.on(TaskMethodsClient.editTask, (taskBServer: TaskBServer) =>
            this.editTaskClient(this.converter.taskBClient(taskBServer))
        );
        this.signalRService.on(TaskMethodsClient.deleteTask, (taskBServer: TaskBServer) =>
            this.deleteTaskClient(this.converter.taskBClient(taskBServer))
        );

        this.taskMovesSource$.pipe(throttleTime(15)).subscribe((task) => this.moveTask(task));
    }

    @Cached()
    loadTasks(boardId: number): Observable<TaskB[]> {
        return this.signalRService.safeInvoke<TaskBServer[]>(TaskMethodsServer.loadTasks, boardId).pipe(
            map((tasksServer: TaskBServer[]) => tasksServer.map((task) => this.converter.taskBClient(task))),
            tap((tasks) => this.loadTasksClient(tasks))
        );
    }

    @Cached()
    addTask(task: TaskB): Observable<TaskB> {
        return this.signalRService.safeInvoke<TaskBServer>(TaskMethodsServer.addTask, this.converter.taskBServer(task)).pipe(
            map((taskServer) => this.converter.taskBClient(taskServer)),
            tap((task) => this.addTaskClient(task))
        );
    }

    @Cached()
    editTask(task: TaskB): Observable<TaskB> {
        return this.signalRService.safeInvoke<TaskBServer>(TaskMethodsServer.editTask, this.converter.taskBServer(task)).pipe(
            map((taskServer) => this.converter.taskBClient(taskServer)),
            tap((task) => this.editTaskClient(task))
        );
    }

    @Cached()
    deleteTask(task: TaskB): Observable<boolean> {
        return this.signalRService
            .safeInvoke<boolean>(TaskMethodsServer.deleteTask, this.converter.taskBServer(task))
            .pipe(tap(() => this.deleteTaskClient(task)));
    }

    private moveTask(task: TaskB): void {
        this.signalRService.safeInvoke(TaskMethodsServer.editTask, this.converter.taskBServer(task)).subscribe();
    }

    private addTaskClient(task: TaskB): void {
        this.tasks.push(task);
    }

    private editTaskClient(task: TaskB): void {
        const index = this.tasks.findIndex((item) => item.taskId === task.taskId);
        if (index !== -1) {
            this.tasks[index] = task;
        }
    }

    private deleteTaskClient(task: TaskB): void {
        const index = this.tasks.findIndex((item) => item.taskId === task.taskId);
        if (index !== -1) {
            this.tasks.splice(index, 1);
        }
    }

    private loadTasksClient(tasks: TaskB[]): void {
        this.tasks.splice(0, this.tasks.length);
        tasks.forEach((task) => this.tasks.push(task));
    }
}
