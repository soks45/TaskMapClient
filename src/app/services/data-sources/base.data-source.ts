import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, shareReplay, switchMap, take, takeUntil } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class DataSourceContext {
    constructor(public resetsOn$: Observable<any>, public resetUntil$: Observable<any>) {}
}

export abstract class BaseDataSource<T> {
    protected abstract dataSource$: Observable<T>;

    private cache$?: Observable<T>;
    private source$: ReplaySubject<T> = new ReplaySubject<T>(1);
    private content$: Observable<T> = this.source$.asObservable();

    protected constructor(private context: DataSourceContext) {
        this.context.resetsOn$.pipe(takeUntil(this.context.resetUntil$)).subscribe(() => this.reset());
    }

    getData(): Observable<T> {
        return this.loadData().pipe(switchMap(() => this.content$));
    }

    reload(): void {
        this.reset();
        this.loadData().subscribe();
    }

    private reset(): void {
        this.cache$ = undefined;
    }

    private loadData(): Observable<T> {
        if (!this.cache$) {
            this.cache$ = this.dataSource$.pipe(shareReplay({ bufferSize: 1, refCount: false }), take(1));
        }

        return this.cache$.pipe(tap((data) => this.source$.next(data)));
    }
}
