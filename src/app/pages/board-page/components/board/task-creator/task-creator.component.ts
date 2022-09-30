import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { Board } from '@models/board';
import { State, TaskB } from '@models/task-b';
import { ShortUser } from '@models/user';
import { AuthService } from '@services/auth.service';
import { CurrentBoardService } from '@services/current-board.service';
import { TaskService } from '@services/task.service';
import { Observable, takeUntil } from 'rxjs';

@Component({
    selector: 'tm-task-creator',
    templateUrl: './task-creator.component.html',
    styleUrls: ['./task-creator.component.scss'],
    providers: [DatePipe],
})
export class TaskCreatorComponent extends DestroyMixin(BaseObject) implements OnInit {
    currentBoard$: Observable<Board>;
    user$: Observable<ShortUser | null>;

    newTask: TaskB = {
        taskId: 1,
        taskText: 'some task definition',
        state: State.Main,
        coordinates: {
            x: 0,
            y: 0,
        },
        taskLabel: 'New Task',
        createdDate: new Date().toString(),
        color: 'green',
        boardId: -1,
        userId: -1,
    };

    constructor(
        private taskService: TaskService,
        private currentBoardService: CurrentBoardService,
        private auth: AuthService
    ) {
        super();
        this.currentBoard$ = this.currentBoardService.currentBoard$;
        this.user$ = this.auth.user$;
    }

    ngOnInit(): void {
        this.currentBoard$
            .pipe(takeUntil(this.destroyed$))
            .subscribe((board) => (this.newTask.boardId = board.boardId));

        this.user$.pipe(takeUntil(this.destroyed$)).subscribe((u) => {
            if (!u) {
                this.newTask.userId = -1;
                return;
            }

            this.newTask.userId = u.userId;
        });
    }

    changeColor(color: string): void {
        this.newTask.color = color;
    }
}
