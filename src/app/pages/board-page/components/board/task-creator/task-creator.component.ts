import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { Board } from '@models/board';
import { Color, TaskB } from '@models/task-b';
import { ShortUser } from '@models/user';
import { Boundary } from '@pages/board-page/components/board/board.component';
import { AuthService } from '@services/auth.service';
import { CurrentBoardService } from '@services/current-board.service';
import { TaskCreatorService } from '@services/task-creator.service';
import { TaskService } from '@services/task.service';
import { Observable, takeUntil } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'tm-task-creator [boundaryCreator]',
    templateUrl: './task-creator.component.html',
    styleUrls: ['./task-creator.component.scss'],
    providers: [DatePipe],
    animations: [
        trigger('smoothAppearance', [
            state('void', style({ opacity: 0.5 })),
            state('*', style({ opacity: 1 })),
            transition('void => *', animate(200)),
            transition('* => void', animate(100)),
        ]),
    ],
})
export class TaskCreatorComponent extends DestroyMixin(BaseObject) implements OnInit {
    @Input()
        boundaryCreator!: Boundary;
    currentBoard$: Observable<Board>;
    user$: Observable<ShortUser | null>;
    isLoading: boolean = false;
    isShowing: boolean = true;
    colorType = Color;
    creatorTask$: Observable<TaskB>;
    boundary: Boundary = {
        boundaryClassName: '',
    };
    isDragging = false;

    constructor(
        private taskService: TaskService,
        private currentBoardService: CurrentBoardService,
        private auth: AuthService,
        private taskCreator: TaskCreatorService
    ) {
        super();
        this.currentBoard$ = this.currentBoardService.currentBoard$;
        this.user$ = this.auth.user$;
        this.creatorTask$ = this.taskCreator.creatorTask$;
    }

    ngOnInit(): void {
        this.currentBoard$
            .pipe(takeUntil(this.destroyed$))
            .subscribe((board) => this.taskCreator.edit({ boardId: board.boardId }));

        this.user$.pipe(takeUntil(this.destroyed$)).subscribe((u) => {
            if (!u) {
                this.taskCreator.edit({
                    userId: -1,
                    boardId: -1,
                });
                return;
            }

            this.taskCreator.edit({
                userId: u.userId,
            });
        });
    }

    changeColor(color: Color): void {
        this.taskCreator.edit({ color: color });
    }

    onCreate(newTask: TaskB): void {
        this.isLoading = true;
        this.taskService
            .add(newTask)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe();
    }

    onDnDStarted($event: CdkDragStart): void {
        this.isDragging = true;
        console.log('onDnDStarted', this.isDragging, $event);
    }

    onDnDEnded($event: CdkDragEnd): void {
        this.isDragging = false;
        console.log('onDnDEnded', this.isDragging, $event);
    }

    onShow($event: MouseEvent): void {
        console.log('onShow', this.isDragging, $event); // TODO fix dnd and click logic
        if (!this.isDragging) {
            this.isShowing = !this.isShowing;
        }
    }
}
