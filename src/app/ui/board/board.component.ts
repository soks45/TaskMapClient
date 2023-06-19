import { animate, state, style, transition, trigger } from '@angular/animations';
import { Point } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { BoardsDataSource } from '@services/data-sources/boards.data-source';
import { CurrentBoardDataSource } from '@services/data-sources/current-board.data-source';
import { TasksService } from '@services/tasks.service';
import { InitItemPosition } from '@ui/adaptive-drag/adaptive-drag.component';
import { CreateBoardDialogComponent } from '@ui/dialogs/create-board-dialog/create-board-dialog.component';
import { Board } from 'app/models/board';
import { TaskB } from 'app/models/task-b';
import { filter, Observable, of, switchMap, take } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdaptiveDragComponent } from '../adaptive-drag/adaptive-drag.component';
import { CardComponent } from '../card/card.component';
import { TaskCreatorComponent } from '../task-creator/task-creator.component';

@Component({
    selector: 'tm-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
    animations: [
        trigger('smoothAppearance', [
            state('void', style({ opacity: 0.5 })),
            state('*', style({ opacity: 1 })),
            transition('void => *', animate(200)),
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgFor, AdaptiveDragComponent, CardComponent, TaskCreatorComponent, AsyncPipe, NgIf, MatButtonModule],
})
export class BoardComponent {
    tasks$?: Observable<TaskB[]>;
    boundaryClassName = 'board';
    showNoCurrentBoardWarning$ = this.currentBoard.state().pipe(map((board) => board === null));

    constructor(
        private taskService: TasksService,
        public currentBoard: CurrentBoardDataSource,
        private dialog: MatDialog,
        private dr: DestroyRef,
        private boards: BoardsDataSource
    ) {
        this.tasks$ = this.currentBoard.state().pipe(
            filter(Boolean),
            switchMap((b) => this.taskService.get(b.boardId))
        );
    }

    initCreatorPosition: InitItemPosition = (boundarySize: Point, sizeOfItem: Point): Point => {
        return {
            x: 1 - (sizeOfItem.x / boundarySize.x + 0.03),
            y: 0.03,
        };
    };

    initCardPosition = (task: TaskB): InitItemPosition => {
        return (_boundarySize: Point, _sizeOfItem: Point): Point => {
            return {
                x: task.x,
                y: task.y,
            };
        };
    };

    contextMenu(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
    }

    createBoardDialog(): void {
        this.dialog
            .open(CreateBoardDialogComponent, { closeOnNavigation: true })
            .afterClosed()
            .pipe(
                switchMap(() => this.boards.state().pipe(take(1))),
                switchMap((boards: Board[]) =>
                    boards.length > 0 ? this.currentBoard.switchBoard(boards[0].boardId) : of(void 0)
                ),
                takeUntilDestroyed(this.dr)
            )
            .subscribe();
    }
}
