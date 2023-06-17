import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { boardGroupHeader } from '@interceptors/board-group.interceptor';
import { ConverterService } from '@services/converter.service';
import { TasksDataSource } from '@services/data-sources/tasks.data-source';
import { MessagesService } from '@services/messages.service';
import { MemoryStorage } from 'app/helpers/memory-storage';
import { TaskB } from 'app/models/task-b';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TasksService {
    private dataSources: MemoryStorage<number, TasksDataSource> = new MemoryStorage();

    constructor(private http: HttpClient, private messages: MessagesService, private converter: ConverterService) {}

    get(boardId: number): Observable<TaskB[]> {
        return this.getDataSource(boardId).getData();
    }

    remove(boardId: number): void {
        this.removeDataSource(boardId);
    }

    add(entity: TaskB): Observable<void> {
        return this.getDataSource(entity.boardId).add(entity);
    }

    edit(entity: TaskB): Observable<void> {
        return this.getDataSource(entity.boardId).edit(entity);
    }

    delete(entity: TaskB): Observable<void> {
        return this.getDataSource(entity.boardId).delete(entity);
    }

    reload(boardId: number): void {
        this.getDataSource(boardId).reload();
    }

    moveTaskInList(taskId: number, previousTaskId: number, boardId: number, newBoardId: number): Observable<void> {
        return this.http
            .put<void>(
                `${environment.apiUrl}/task/list/${taskId}&${newBoardId}&${previousTaskId}`,
                {},
                {
                    headers: boardGroupHeader(),
                }
            )
            .pipe(
                tap(() =>
                    boardId !== newBoardId
                        ? (this.getDataSource(boardId).reload(), this.getDataSource(newBoardId).reload())
                        : this.getDataSource(boardId).reload()
                )
            );
    }

    getDataSource(boardId: number): TasksDataSource {
        let dataSource = this.dataSources.getItem(boardId);

        if (!dataSource) {
            dataSource = this.createDataSource(boardId);
            this.dataSources.setItem(boardId, dataSource);
        }

        return dataSource;
    }

    private createDataSource(boardId: number): TasksDataSource {
        return new TasksDataSource(boardId, this.converter, this.http);
    }

    private removeDataSource(boardId: number): void {
        this.dataSources.removeItem(boardId);
    }
}
