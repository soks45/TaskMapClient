import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { AuthService } from '@services/auth.service';
import { BoardService } from '@services/board.service';
import { CurrentBoardService } from '@services/current-board.service';
import { TaskService } from '@services/task.service';

@Component({
    selector: 'tm-board-page',
    templateUrl: './board-page.component.html',
    styleUrls: ['./board-page.component.scss'],
})
export class BoardPageComponent extends DestroyMixin(BaseObject) {
    constructor(
        private boardService: BoardService,
        private taskService: TaskService,
        private auth: AuthService,
        private dialog: MatDialog,
        private currentBoardService: CurrentBoardService
    ) {
        super();
    }

    private boardId = 4;

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
                boardId: 11,
                boardDescription: 'somedaw',
                boardName: 'edik',
                createdDate: 'daw',
                userId: 3,
            })
            .subscribe((value) => console.log(value));
    }

    delete4() {
        this.boardService
            .delete({
                boardId: 4,
                boardDescription: 'somedaw',
                boardName: 'edited',
                createdDate: 'daw',
                userId: 1,
            })
            .subscribe((value) => console.log(value));
    }

    delete9() {
        this.boardService
            .delete({
                boardId: 9,
                boardDescription: 'somedaw',
                boardName: 'edited',
                createdDate: 'daw',
                userId: 1,
            })
            .subscribe((value) => console.log(value));
    }

    delete10() {
        this.boardService
            .delete({
                boardId: 10,
                boardDescription: 'somedaw',
                boardName: 'edited',
                createdDate: 'daw',
                userId: 1,
            })
            .subscribe((value) => console.log(value));
    }

    switch4() {
        this.boardId = 4;
        this.currentBoardService.switchBoard(4).subscribe();
    }

    switch10() {
        this.boardId = 10;
        this.currentBoardService.switchBoard(10).subscribe();
    }

    switch11() {
        this.boardId = 11;
        this.currentBoardService.switchBoard(11).subscribe();
    }

    addTask() {
        this.taskService
            .add({
                boardId: this.boardId,
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
