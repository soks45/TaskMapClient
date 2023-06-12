import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, ReplaySubject, shareReplay, switchMap, take } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class DataSourceContext {
    constructor(public resetsOn$: Observable<any>, public dr: DestroyRef) {}
}

export abstract class BaseDataSource<T> {
    protected abstract dataSource$: Observable<T>;

    private cache$?: Observable<T>;
    private source$: ReplaySubject<T> = new ReplaySubject<T>(1);

    protected constructor(private context: DataSourceContext) {
        this.context.resetsOn$.pipe(takeUntilDestroyed(context.dr)).subscribe(() => this.reset());
    }

    getData(): Observable<T> {
        return this.loadData().pipe(switchMap(() => this.source$));
    }

    lastValue(): Observable<T> {
        return this.getData().pipe(take(1));
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
