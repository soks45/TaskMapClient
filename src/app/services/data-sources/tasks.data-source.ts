import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ConverterService } from '@services/converter.service';
import { BaseDataSource, DataSourceContext } from '@services/data-sources/base.data-source';
import { TaskB } from 'app/models/task-b';
import { Observable, tap } from 'rxjs';

export class TasksDataSource extends BaseDataSource<TaskB[]> {
    protected dataSource$ = this.http.get<TaskB[]>(`${environment.apiUrl}/task/${this.boardId}`, {
        withCredentials: true,
    });

    constructor(
        public readonly boardId: number,
        private converter: ConverterService,
        private http: HttpClient,
        private dataSourceContext: DataSourceContext
    ) {
        super(dataSourceContext);
    }

    add(entity: TaskB): Observable<void> {
        return this.http
            .post<void>(`${environment.apiUrl}/task`, this.converter.taskBServer(entity), { withCredentials: true })
            .pipe(tap(() => this.reload()));
    }

    edit(entity: TaskB): Observable<void> {
        return this.http
            .put<void>(`${environment.apiUrl}/task`, this.converter.taskBServer(entity), { withCredentials: true })
            .pipe(tap(() => this.reload()));
    }

    delete(entity: TaskB): Observable<void> {
        return this.http
            .delete<void>(`${environment.apiUrl}/task/${entity.taskId}`, { withCredentials: true })
            .pipe(tap(() => this.reload()));
    }
}
