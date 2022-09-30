import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@services/auth.service';
import { BoardService } from '@services/board.service';
import { CurrentBoardService } from '@services/current-board.service';
import { TaskService } from '@services/task.service';

@Component({
    selector: 'tm-board-page',
    templateUrl: './board-page.component.html',
    styleUrls: ['./board-page.component.scss'],
})
export class BoardPageComponent {
    constructor(
        private boardService: BoardService,
        private taskService: TaskService,
        private auth: AuthService,
        private dialog: MatDialog,
        private currentBoardService: CurrentBoardService
    ) {}

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

    switch34() {
        this.boardId = 34;
        this.currentBoardService.switchBoard(34).subscribe();
    }

    switch12() {
        this.boardId = 12;
        this.currentBoardService.switchBoard(12).subscribe();
    }

    switch13() {
        this.boardId = 13;
        this.currentBoardService.switchBoard(13).subscribe();
    }

    switch15() {
        this.boardId = 15;
        this.currentBoardService.switchBoard(15).subscribe();
    }

    addTask() {
        this.taskService
            .add({
                boardId: 34,
                taskId: 3,
                createdDate: '',
                taskLabel: 'SUY&PE',
                taskText: 'dawdaw',
                color: 'purple',
                userId: 3,
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
