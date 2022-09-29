import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Board } from '@models/board';
import { MessagesService } from '@services/messages.service';
import { AsyncSubject, mergeMap, Observable, ReplaySubject, share, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CurrentBoardService {
    readonly currentBoard$: Observable<Board>;
    private currentBoardSource: ReplaySubject<Board> = new ReplaySubject<Board>(1);
    private cache$: Observable<Board> | undefined;

    constructor(private http: HttpClient, private messages: MessagesService) {
        this.currentBoard$ = this.currentBoardSource.asObservable();
    }

    currentBoard(): Observable<Board> {
        return this.load().pipe(mergeMap(() => this.currentBoard$));
    }

    switchBoard(id: number): Observable<void> {
        return this.http.patch<void>(`${environment.apiUrl}/account/last-board/${id}`, null, { withCredentials: true }).pipe(
            catchError((err) => {
                throw err;
            }),
            tap(() => this.reload())
        );
    }

    private reload(): void {
        this.cache$ = undefined;
        this.load().subscribe();
    }

    private load(): Observable<Board> {
        if (!this.cache$) {
            this.cache$ = this.http.get<number>(`${environment.apiUrl}/account/last-board`, { withCredentials: true }).pipe(
                share({
                    connector: () => new AsyncSubject(),
                    resetOnError: false,
                    resetOnComplete: false,
                    resetOnRefCountZero: false,
                }),
                catchError((err) => {
                    this.messages.error(err);
                    this.cache$ = undefined;
                    throw err;
                }),
                mergeMap((id) => this.getBoard(id))
            );
        }

        return this.cache$.pipe(tap((board) => this.currentBoardSource.next(board)));
    }

    private getBoard(id: number): Observable<Board> {
        return this.http.get<Board>(`${environment.apiUrl}/board/${id}`, { withCredentials: true });
    }
}
