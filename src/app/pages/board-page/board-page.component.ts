import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { Board } from '@models/board';
import { AuthService } from '@services/auth.service';
import { BoardService } from '@services/board.service';
import { TaskService } from '@services/task.service';
import { UserLastBoardService } from '@services/user-last-board.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'tm-board-page',
    templateUrl: './board-page.component.html',
    styleUrls: ['./board-page.component.scss'],
})
export class BoardPageComponent extends DestroyMixin(BaseObject) {
    currentBoard$: Observable<Board>;

    constructor(
        private boardService: BoardService,
        private taskService: TaskService,
        private auth: AuthService,
        private dialog: MatDialog,
        private lastBoardService: UserLastBoardService
    ) {
        super();
        this.currentBoard$ = this.lastBoardService.lastBoard();
        this.currentBoard$.subscribe((value) => console.log(value));
    }

    get() {
        this.boardService.get().subscribe((value) => console.log(value));
    }

    add() {
        this.boardService
            .add({
                boardId: 1,
                boardDescription: 'somedaw',
                boardName: 'NAME',
                createdDate: 'daw',
                userId: 1,
            })
            .subscribe((value) => console.log(value));
    }

    edit() {
        this.boardService
            .edit({
                boardId: 8,
                boardDescription: 'somedaw',
                boardName: 'edited',
                createdDate: 'daw',
                userId: 1,
            })
            .subscribe((value) => console.log(value));
    }

    delete() {
        this.boardService
            .delete({
                boardId: 8,
                boardDescription: 'somedaw',
                boardName: 'edited',
                createdDate: 'daw',
                userId: 1,
            })
            .subscribe((value) => console.log(value));
    }

    switch() {
        this.lastBoardService.switchBoard(4).subscribe();
    }

    addTask() {
        this.taskService
            .add({
                boardId: 4,
                taskId: 1,
                createdDate: '',
                taskLabel: 'SUY&PE',
                taskText: 'dawdaw',
                color: 'purple',
                userId: 4,
                state: 1,
                coordinates: {
                    x: 1,
                    y: 2,
                },
            })
            .subscribe();
    }

    editTask() {}

    deleteTask() {}
}
