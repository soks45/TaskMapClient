import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { Board } from '@models/board';
import { User } from '@models/user';
import { BaseTask, EditCardDialogComponent } from '@pages/board-page/components/board/edit-card-dialog/edit-card-dialog.component';
import { AuthService } from '@services/auth.service';
import { BoardService } from '@services/board.service';
import { MessagesService } from '@services/messages.service';
import { TaskService } from '@services/task-service';
import { Observable, switchMap, takeUntil, throwError } from 'rxjs';

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
        private dialog: MatDialog,
        private messages: MessagesService
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

    showSnackBarInfo() {
        this.messages.info('info');
    }

    showSnackBarSuccess() {
        this.messages.success('success');
    }

    showSnackBarError() {
        this.messages.error('error');
    }

    get(): void {
        this.boardService.getBoards().subscribe((res) => console.log(res));
    }

    add(): void {
        this.boardService
            .addBoard({
                boardId: 1,
                boardName: 'board',
                userId: 3,
                boardDescription: 'dawwad',
                createdDate: 'dwa',
            })
            .subscribe((res) => console.log(res));
    }

    edit(): void {
        this.boardService
            .editBoard({
                boardId: 7,
                boardName: 'editedboard',
                userId: 3,
                boardDescription: 'dawwad',
                createdDate: 'dwa',
            })
            .subscribe((res) => console.log(res));
    }

    delete(): void {
        this.boardService.deleteBoard(7).subscribe((res) => console.log(res));
    }
}
