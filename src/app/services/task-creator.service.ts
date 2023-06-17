import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrentBoardDataSource } from '@services/data-sources/current-board.data-source';
import { Color, State, TaskB } from 'app/models/task-b';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TaskCreatorService {
    public creatorTaskSource: BehaviorSubject<TaskB> = new BehaviorSubject<TaskB>({
        taskId: 0,
        taskText: 'some task definition',
        state: State.Main,
        x: 0,
        y: 0,
        taskLabel: 'New Task',
        createdDate: new Date().toString(),
        color: Color.Green,
        boardId: 0,
        userId: 0,
        next_task_id: 0,
    });

    constructor(private currentBoardService: CurrentBoardDataSource) {
        this.currentBoardService
            .state()
            .pipe(
                tap((board) => this.edit({ boardId: board.boardId })),
                takeUntilDestroyed()
            )
            .subscribe();
    }

    edit(task: Partial<TaskB>): void {
        this.creatorTaskSource.next(<TaskB>{
            ...this.creatorTaskSource.value,
            ...task,
        });
    }
}
