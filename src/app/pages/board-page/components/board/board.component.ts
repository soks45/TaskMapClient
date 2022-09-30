import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { Board } from '@models/board';
import { TaskB } from '@models/task-b';
import { ShortUser } from '@models/user';
import { AuthService } from '@services/auth.service';
import { CurrentBoardService } from '@services/current-board.service';
import { TaskService } from '@services/task.service';
import { Observable, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'tm-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
    animations: [
        trigger('state', [
            state('void', style({ opacity: 0.5 })),
            state('*', style({ opacity: 1 })),
            transition('void => *', animate(200)),
        ]),
    ],
})
export class BoardComponent extends DestroyMixin(BaseObject) {
    tasks$?: Observable<TaskB[]>;
    currentBoard$: Observable<Board>;
    user$: Observable<ShortUser | null>;

    constructor(
        private taskService: TaskService,
        private currentBoard: CurrentBoardService,
        private auth: AuthService
    ) {
        super();
        this.user$ = this.auth.user$;
        this.currentBoard$ = this.currentBoard.currentBoard().pipe(
            takeUntil(this.destroyed$),
            tap((b) => (this.tasks$ = this.taskService.get(b.boardId)))
        );
    }

    contextMenu(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
    }
}
