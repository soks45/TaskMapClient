import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { CurrentBoardDataSource } from '@services/data-sources/current-board.data-source';
import { Board } from 'app/models/board';
import { Observable, switchMap, take } from 'rxjs';

const NEED_BOARD_GROUP = 'Board-Group';

export function boardGroupHeader(headers?: HttpHeaders): HttpHeaders {
    if (!headers) {
        headers = new HttpHeaders();
    }

    return headers.set(NEED_BOARD_GROUP, NEED_BOARD_GROUP);
}

@Injectable()
export class BoardGroupInterceptor implements HttpInterceptor {
    constructor(private currentBoardService: CurrentBoardDataSource) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (request.headers.has(NEED_BOARD_GROUP)) {
            return this.currentBoardService.state().pipe(
                take(1),
                switchMap((currentBoard: Board) =>
                    next.handle(
                        request.clone({
                            setHeaders: { [NEED_BOARD_GROUP]: currentBoard.boardId.toString() },
                        })
                    )
                )
            );
        }

        return next.handle(request);
    }
}
