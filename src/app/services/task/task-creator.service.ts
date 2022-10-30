import { Injectable } from '@angular/core';
import { Board } from '@models/board';
import { Color, State, TaskB } from '@models/task-b';
import { ShortUser } from '@models/user';
import { AuthService } from '@services/auth.service';
import { CurrentBoardService } from '@services/board/current-board.service';
import { BehaviorSubject, Observable } from 'rxjs';

interface EditTask {
    taskId?: number;
    boardId?: number;
    x?: number;
    t?: number;
    userId?: number;
    createdDate?: string;
    taskLabel?: string;
    taskText?: string;
    color?: Color;
    state?: State;
}

@Injectable({
    providedIn: 'root',
})
export class TaskCreatorService {
    readonly creatorTask$: Observable<TaskB>;
    private creatorTaskSource: BehaviorSubject<TaskB>;
    private currentBoard$: Observable<Board>;
    private user$: Observable<ShortUser | null>;

    constructor(private currentBoardService: CurrentBoardService, private auth: AuthService) {
        this.creatorTaskSource = new BehaviorSubject<TaskB>(this.createNewDefaultTask());
        this.creatorTask$ = this.creatorTaskSource.asObservable();

        this.currentBoard$ = this.currentBoardService.currentBoard$;
        this.user$ = this.auth.user$;

        this.currentBoard$.subscribe((board) => this.edit({ boardId: board.boardId }));

        this.user$.subscribe((u) => {
            if (!u) {
                this.edit({
                    userId: -1,
                    boardId: -1,
                });
                return;
            }

            this.edit({
                userId: u.userId,
            });
        });
    }

    edit(task: EditTask): void {
        this.creatorTaskSource.next({
            ...this.creatorTaskSource.value,
            ...task,
        });
    }

    createNewDefaultTask(): TaskB {
        return {
            taskId: 1,
            taskText: 'some task definition',
            state: State.Main,
            x: 0,
            y: 0,
            taskLabel: 'New Task',
            createdDate: new Date().toString(),
            color: Color.Green,
            boardId: -1,
            userId: -1,
            nextTaskId: 0,
        };
    }
}
