import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ConverterService } from '@services/converter.service';
import { SignalRService } from '@services/signalR.service';
import { TaskB } from 'app/models/task-b';
import { Observable, switchMap, tap } from 'rxjs';
import { DataSubject } from 'rxjs-data-subject';

export class TasksDataSource extends DataSubject<TaskB[]> {
    constructor(
        public readonly boardId: number,
        private converter: ConverterService,
        private http: HttpClient,
        private signalRService: SignalRService
    ) {
        super(
            http.get<TaskB[]>(`${environment.apiUrl}/task/${boardId}`, {
                withCredentials: true,
            })
        );

        this.signalRService.hubConnection.on('TaskListChangedNotification', (id) =>
            Number(id) === boardId ? this.reload() : void 0
        );
    }

    add(entity: TaskB): Observable<void> {
        return this.http
            .post<void>(`${environment.apiUrl}/task`, this.converter.taskBServer(entity), {
                withCredentials: true,
            })
            .pipe(
                tap(() => this.reload()),
                switchMap(() => this.signalRService.sendTaskListChangedEvent(entity.boardId))
            );
    }

    edit(entity: TaskB): Observable<void> {
        return this.http
            .put<void>(`${environment.apiUrl}/task`, this.converter.taskBServer(entity), {
                withCredentials: true,
            })
            .pipe(
                tap(() => this.reload()),
                switchMap(() => this.signalRService.sendTaskListChangedEvent(entity.boardId))
            );
    }

    delete(entity: TaskB): Observable<void> {
        return this.http
            .delete<void>(`${environment.apiUrl}/task/${entity.taskId}`, {
                withCredentials: true,
            })
            .pipe(
                tap(() => this.reload()),
                switchMap(() => this.signalRService.sendTaskListChangedEvent(entity.boardId))
            );
    }
}
