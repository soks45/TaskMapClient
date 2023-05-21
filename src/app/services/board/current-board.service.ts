import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '@environments/environment';
import { AuthService } from '@services/auth.service';
import { Board } from 'app/models/board';
import { AsyncSubject, filter, mergeMap, Observable, ReplaySubject, share, Subject, takeUntil, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CurrentBoardService implements OnDestroy {
    readonly currentBoard$: Observable<Board>;
    private currentBoardSource: ReplaySubject<Board> = new ReplaySubject<Board>(1);
    private destroy$: Subject<void> = new Subject<void>();
    cache$: Observable<Board> | undefined;

    constructor(private http: HttpClient, private authService: AuthService) {
        this.currentBoard$ = this.currentBoardSource.asObservable();
        this.authService.isAuthed$
            .pipe(
                filter((authed) => !authed),
                takeUntil(this.destroy$)
            )
            .subscribe(() => (this.cache$ = undefined));
    }

    currentBoard(): Observable<Board> {
        return this.load().pipe(mergeMap(() => this.currentBoard$));
    }

    switchBoard(id: number): Observable<void> {
        return this.http
            .patch<void>(`${environment.apiUrl}/account/last-board/${id}`, null, { withCredentials: true })
            .pipe(tap(() => this.reload()));
    }

    private reload(): void {
        this.cache$ = undefined;
        this.load().subscribe();
    }

    private load(): Observable<Board> {
        if (!this.cache$) {
            this.cache$ = this.http
                .get<number>(`${environment.apiUrl}/account/last-board`, { withCredentials: true })
                .pipe(
                    share({
                        connector: () => new AsyncSubject(),
                        resetOnError: false,
                        resetOnComplete: false,
                        resetOnRefCountZero: false,
                    }),
                    mergeMap((id) => this.getBoard(id))
                );
        }

        return this.cache$.pipe(tap((board) => this.currentBoardSource.next(board)));
    }

    private getBoard(id: number): Observable<Board> {
        return this.http.get<Board>(`${environment.apiUrl}/board/${id}`, { withCredentials: true });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
