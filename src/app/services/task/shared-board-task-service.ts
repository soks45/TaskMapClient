import { Injectable } from '@angular/core';
import { TaskB } from '@models/task-b';
import { ConverterService } from '@services/converter.service';
import { TaskHubService } from '@services/task/task-hub.service';
import { Observable, Subject, throttleTime } from 'rxjs';
import { tap } from 'rxjs/operators';

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

        this.signalRService.on(TaskMethodsClient.addTask, (taskB: TaskB) => this.addTaskClient(taskB));
        this.signalRService.on(TaskMethodsClient.editTask, (taskB: TaskB) => this.editTaskClient(taskB));
        this.signalRService.on(TaskMethodsClient.deleteTask, (taskB: TaskB) => this.deleteTaskClient(taskB));

        this.taskMovesSource$.pipe(throttleTime(15)).subscribe((task) => this.moveTask(task));
    }

    loadTasks(boardId: number): Observable<TaskB[]> {
        return this.signalRService
            .safeInvoke<TaskB[]>(TaskMethodsServer.loadTasks, boardId)
            .pipe(tap((tasks) => this.loadTasksClient(tasks)));
    }

    addTask(task: TaskB): Observable<TaskB> {
        return this.signalRService
            .safeInvoke<TaskB>(TaskMethodsServer.addTask, this.converter.taskBServer(task))
            .pipe(tap((task) => this.addTaskClient(task)));
    }

    editTask(task: TaskB): Observable<TaskB> {
        return this.signalRService
            .safeInvoke<TaskB>(TaskMethodsServer.editTask, this.converter.taskBServer(task))
            .pipe(tap((task) => this.editTaskClient(task)));
    }

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
