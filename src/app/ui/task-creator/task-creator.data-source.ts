import { Injectable } from '@angular/core';
import { BaseDataSource, DataSourceContext } from '@services/data-sources/base.data-source';
import { CurrentBoardDataSource } from '@services/data-sources/current-board.data-source';
import { DestroyService } from 'app/helpers/destroy.service';
import { Color, State, TaskB } from 'app/models/task-b';
import { BehaviorSubject, Observable, takeUntil, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TaskCreatorDataSource extends BaseDataSource<TaskB> {
    private creatorTaskSource: BehaviorSubject<TaskB> = new BehaviorSubject<TaskB>({
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
    protected dataSource$: Observable<TaskB> = this.creatorTaskSource.asObservable();

    constructor(
        private currentBoardService: CurrentBoardDataSource,
        private dataSourceContext: DataSourceContext,
        private destroyed$: DestroyService
    ) {
        super(dataSourceContext);

        this.currentBoardService
            .getData()
            .pipe(
                tap((board) => this.edit({ boardId: board.boardId })),
                takeUntil(destroyed$)
            )
            .subscribe();
    }

    edit(task: Partial<TaskB>): void {
        this.creatorTaskSource.next(<TaskB>{
            ...this.creatorTaskSource.value,
            ...task,
        });

        this.reload();
    }
}
