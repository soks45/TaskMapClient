import { animate, state, style, transition, trigger } from '@angular/animations';
import { Point } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrentBoardDataSource } from '@services/data-sources/current-board.data-source';
import { TasksService } from '@services/tasks.service';
import { InitItemPosition } from '@ui/adaptive-drag/adaptive-drag.component';
import { TaskB } from 'app/models/task-b';
import { Observable, switchMap } from 'rxjs';
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
    imports: [NgFor, AdaptiveDragComponent, CardComponent, TaskCreatorComponent, AsyncPipe],
})
export class BoardComponent {
    @Input()
    set id(boardId: string) {
        if (boardId && isFinite(Number(boardId)) && !isNaN(Number(boardId))) {
            this.currentBoard.switchBoard(Number(boardId)).subscribe();
        }
    }

    tasks$?: Observable<TaskB[]>;
    boundaryClassName = 'board';

    constructor(private taskService: TasksService, private currentBoard: CurrentBoardDataSource) {
        this.tasks$ = this.currentBoard.getData().pipe(
            switchMap((b) => this.taskService.get(b.boardId)),
            takeUntilDestroyed()
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
}
