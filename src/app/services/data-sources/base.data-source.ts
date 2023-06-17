import { mergeMap, Observable, ReplaySubject, shareReplay, tap } from 'rxjs';
import { take } from 'rxjs/operators';

export abstract class BaseDataSource<T> {
    protected abstract dataSource$: Observable<T>;

    private cache$?: Observable<T>;
    private source$: ReplaySubject<T> = new ReplaySubject<T>(1);

    getData(): Observable<T> {
        return this.loadData().pipe(mergeMap(() => this.source$));
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
