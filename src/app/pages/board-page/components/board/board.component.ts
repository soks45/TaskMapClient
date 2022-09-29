import { Component, OnInit } from '@angular/core';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { Board } from '@models/board';
import { TaskB } from '@models/task-b';
import { CurrentBoardService } from '@services/current-board.service';
import { TaskService } from '@services/task.service';
import { Observable, tap } from 'rxjs';

@Component({
    selector: 'tm-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent extends DestroyMixin(BaseObject) implements OnInit {
    tasks$?: Observable<TaskB[]>;
    currentBoard$?: Observable<Board>;

    constructor(private taskService: TaskService, private currentBoard: CurrentBoardService) {
        super();
    }

    contextMenu(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
    }

    ngOnInit(): void {
        this.currentBoard$ = this.currentBoard.lastBoard().pipe(tap((b) => (this.tasks$ = this.taskService.get(b.boardId))));
    }
}
