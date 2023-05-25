import { Injectable } from '@angular/core';
import { CurrentBoardService } from '@services/board/current-board.service';
import { Color, State, TaskB } from 'app/models/task-b';
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

    constructor(private currentBoardService: CurrentBoardService) {
        this.creatorTask$ = this.creatorTaskSource.asObservable();
        this.currentBoardService.currentBoard$.pipe(tap((board) => this.edit({ boardId: board.boardId }))).subscribe();
    }

    edit(task: EditTask): void {
        this.creatorTaskSource.next(<TaskB>{
            ...this.creatorTaskSource.value,
            ...task,
        });
    }

    createNewDefaultTask(): TaskB {
        return {
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
        };
    }
}
