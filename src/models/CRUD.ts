import { Observable } from 'rxjs';

export interface CRUD<T> {
    content$: Observable<T[]>;

    get(...args: any): Observable<T[]>;

    add(entity: T): Observable<void>;

    edit(entity: T): Observable<void>;

    delete(id: number, ...args: any): Observable<void>;
}
