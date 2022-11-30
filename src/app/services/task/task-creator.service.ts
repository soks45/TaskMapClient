import { Injectable } from '@angular/core';
import { Color, State, TaskB } from '@models/task-b';
import { AuthService } from '@services/auth.service';
import { CurrentBoardService } from '@services/board/current-board.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';

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
    private creatorTaskSource: BehaviorSubject<TaskB> = new BehaviorSubject<TaskB>(this.createNewDefaultTask());

    constructor(private currentBoardService: CurrentBoardService, private auth: AuthService) {
        this.creatorTask$ = this.creatorTaskSource.asObservable();

        this.currentBoardService.currentBoard$.pipe(tap((board) => this.edit({ boardId: board.boardId }))).subscribe();
        this.auth.user$
            .pipe(
                tap((u) => {
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
                })
            )
            .subscribe();
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
