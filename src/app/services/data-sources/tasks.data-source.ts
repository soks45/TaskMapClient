import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { boardGroupHeader } from '@interceptors/board-group.interceptor';
import { ConverterService } from '@services/converter.service';
import { TaskB } from 'app/models/task-b';
import { Observable, tap } from 'rxjs';
import { DataSubject } from 'rxjs-data-subject';

export class TasksDataSource extends DataSubject<TaskB[]> {
    constructor(public readonly boardId: number, private converter: ConverterService, private http: HttpClient) {
        super(
            http.get<TaskB[]>(`${environment.apiUrl}/task/${boardId}`, {
                withCredentials: true,
            })
        );
    }

    add(entity: TaskB): Observable<void> {
        return this.http
            .post<void>(`${environment.apiUrl}/task`, this.converter.taskBServer(entity), {
                withCredentials: true,
                headers: boardGroupHeader(),
            })
            .pipe(tap(() => this.reload()));
    }

    edit(entity: TaskB): Observable<void> {
        return this.http
            .put<void>(`${environment.apiUrl}/task`, this.converter.taskBServer(entity), {
                withCredentials: true,
                headers: boardGroupHeader(),
            })
            .pipe(tap(() => this.reload()));
    }

    delete(entity: TaskB): Observable<void> {
        return this.http
            .delete<void>(`${environment.apiUrl}/task/${entity.taskId}`, {
                withCredentials: true,
                headers: boardGroupHeader(),
            })
            .pipe(tap(() => this.reload()));
    }
}
