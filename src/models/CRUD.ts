import { Observable } from 'rxjs';

export interface CRUD<T> {
    content$: Observable<T[]>;

    get(): Observable<T[]>;

    add(entity: T): Observable<void>;

    edit(entity: T): Observable<void>;

    delete(id: number): Observable<void>;
}
