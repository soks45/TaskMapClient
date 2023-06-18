import {
    CdkDrag,
    CdkDragDrop,
    CdkDragPreview,
    CdkDropList,
    CdkDropListGroup,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AsyncPipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { BoardsDataSource } from '@services/data-sources/boards.data-source';
import { TasksService } from '@services/tasks.service';
import { CardComponent } from '@ui/card/card.component';
import { Board } from 'app/models/board';
import { TaskB } from 'app/models/task-b';
import { combineLatest, Observable, of, switchMap, take } from 'rxjs';
import { map } from 'rxjs/operators';

interface BoardWithTasks extends Board {
    tasks: TaskB[];
}

@Component({
    selector: 'tm-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CdkDropListGroup,
        NgStyle,
        NgFor,
        CdkDropList,
        CdkDrag,
        CardComponent,
        CdkDragPreview,
        AsyncPipe,
        MatMenuModule,
        MatIconModule,
        NgIf,
    ],
})
export default class DashboardComponent {
    boards$: Observable<BoardWithTasks[]>;
    readonly idPrefix = 'boardId-';

    @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;

    contextMenuPosition = { x: '0px', y: '0px' };

    constructor(private boardService: BoardsDataSource, private tasks: TasksService) {
        this.boards$ = this.boardService.state().pipe(
            switchMap((boards) => {
                if (boards.length === 0) {
                    return of([]);
                }

                return this.boardsWithTasks(boards);
            })
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
            this.tasks.moveTaskInList(taskId, previousTaskId, boardId, newBoardId).pipe(take(1)).subscribe();
        }
    }

    getId(idString: string): number {
        return Number(idString.replace(this.idPrefix, ''));
    }

    setId(boardId: number): string {
        return this.idPrefix + boardId;
    }

    deleteBoard(board: Board): void {
        this.boardService.delete(board).subscribe();
    }

    onContextMenu(event: MouseEvent, item: Board) {
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        this.contextMenu.menuData = { item: item };
        this.contextMenu.menu?.focusFirstItem('mouse');
        this.contextMenu.openMenu();
    }

    private boardsWithTasks(boards: Board[]): Observable<BoardWithTasks[]> {
        return combineLatest(
            boards.map((board) =>
                this.tasks.get(board.boardId).pipe(
                    map((tasks) => ({
                        ...board,
                        tasks,
                    }))
                )
            )
        );
    }
}
