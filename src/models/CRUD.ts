import { Observable } from 'rxjs';

export interface CRUD<T> {
    get(id?: number): Observable<T[]>;

    add(entity: T): Observable<void>;

    edit(entity: T): Observable<void>;

    delete(entity: T): Observable<void>;
}
