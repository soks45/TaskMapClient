import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, switchMap, takeUntil, throwError } from 'rxjs';
import { DestroyMixin } from 'src/app/mixins/destroy.mixin';
import { BaseObject } from 'src/app/mixins/mixins';
import { BaseTask, EditCardDialogComponent } from 'src/app/pages/board-page/components/board/edit-card-dialog/edit-card-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { BoardService } from 'src/app/services/board.service';
import { TaskService } from 'src/app/services/task-service';
import { Board } from 'src/models/board';
import { User } from 'src/models/user';

@Component({
    selector: 'tm-board-page',
    templateUrl: './board-page.component.html',
    styleUrls: ['./board-page.component.scss'],
})
export class BoardPageComponent extends DestroyMixin(BaseObject) implements OnInit {
    currentBoard$: Observable<Board>;
    currentBoard?: Board;
    currentUser: User | null = null;

    constructor(
        private boardService: BoardService,
        private taskService: TaskService,
        private auth: AuthService,
        private dialog: MatDialog
    ) {
        super();
        this.currentBoard$ = this.boardService.currentBoard$;
        this.currentBoard$.pipe(takeUntil(this.destroyed$)).subscribe((board) => (this.currentBoard = board));
        this.auth.user$.pipe(takeUntil(this.destroyed$)).subscribe((user) => (this.currentUser = user));
    }

    ngOnInit(): void {
        this.boardService
            .getBoards()
            .pipe(
                takeUntil(this.destroyed$),
                switchMap((boards: Board[]) => {
                    if (boards.length === 0) {
                        return throwError(() => 'You have no boards');
                    }

                    if (this.boardService.lastBoardId) {
                        const index = boards.findIndex((board) => board.boardId === this.boardService.lastBoardId);
                        if (index !== -1) {
                            return this.boardService.switchBoard(boards[index]);
                        }
                    }

                    return this.boardService.switchBoard(boards[0]);
                })
            )
            .subscribe();
    }

    createTask() {
        if (this.currentBoard && this.currentUser) {
            this.dialog.open(EditCardDialogComponent, {
                data: <BaseTask>{
                    boardId: this.currentBoard.boardId,
                    userId: this.currentUser.userId,
                },
            });
        }
    }
}
