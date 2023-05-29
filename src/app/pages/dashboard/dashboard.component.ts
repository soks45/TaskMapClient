import {
    CdkDrag,
    CdkDragDrop,
    CdkDragPreview,
    CdkDropList,
    CdkDropListGroup,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AsyncPipe, NgFor, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BoardsDataSource } from '@services/data-sources/boards.data-source';
import { TasksService } from '@services/tasks.service';
import { CardComponent } from '@ui/card/card.component';
import { Board } from 'app/models/board';
import { TaskB } from 'app/models/task-b';
import { combineLatest, Observable, switchMap } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

interface BoardWithTasks extends Board {
    tasks: TaskB[];
}

@Component({
    selector: 'tm-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CdkDropListGroup, NgStyle, NgFor, CdkDropList, CdkDrag, CardComponent, CdkDragPreview, AsyncPipe],
})
export default class DashboardComponent implements OnInit {
    boards$?: Observable<BoardWithTasks[]>;
    isLoading: boolean = false;
    readonly idPrefix = 'boardId-';

    constructor(private boardService: BoardsDataSource, private tasks: TasksService) {}

    ngOnInit(): void {
        this.boards$ = this.boardService.getData().pipe(
            switchMap((boards) =>
                combineLatest(
                    boards.map((board) =>
                        this.tasks.get(board.boardId).pipe(
                            map((tasks) => ({
                                ...board,
                                tasks,
                            }))
                        )
                    )
                )
            )
        );
    }

    drop($event: CdkDragDrop<TaskB[]>) {
        if ($event.previousContainer === $event.container) {
            moveItemInArray($event.container.data, $event.previousIndex, $event.currentIndex);
        } else {
            transferArrayItem(
                $event.previousContainer.data,
                $event.container.data,
                $event.previousIndex,
                $event.currentIndex
            );
        }

        const boardId = this.getId($event.previousContainer.id);
        const newBoardId = this.getId($event.container.id);
        const taskId = $event.container.data[$event.currentIndex].taskId;
        const previousTaskId = $event.currentIndex === 0 ? 0 : $event.container.data[$event.currentIndex - 1].taskId;

        if (boardId !== newBoardId || (boardId === newBoardId && $event.previousIndex !== $event.currentIndex)) {
            this.isLoading = true;
            this.tasks
                .moveTaskInList(taskId, previousTaskId, boardId, newBoardId)
                .pipe(finalize(() => (this.isLoading = false)))
                .subscribe();
        }
    }

    getId(idString: string): number {
        return Number(idString.replace(this.idPrefix, ''));
    }

    setId(boardId: number): string {
        return this.idPrefix + boardId;
    }
}
