import { animate, state, style, transition, trigger } from '@angular/animations';
import { Point } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CurrentBoardService } from '@services/board/current-board.service';
import { TaskService } from '@services/task/task.service';
import { InitItemPosition } from '@ui/adaptive-drag/adaptive-drag.component';
import { DestroyService } from 'app/helpers/destroy.service';
import { TaskB } from 'app/models/task-b';
import { Observable, switchMap, takeUntil } from 'rxjs';
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
    standalone: true,
    imports: [NgFor, AdaptiveDragComponent, CardComponent, TaskCreatorComponent, AsyncPipe],
    providers: [DestroyService],
})
export class BoardComponent implements OnInit {
    tasks$?: Observable<TaskB[]>;
    boundaryClassName = 'board';

    constructor(
        private taskService: TaskService,
        private currentBoard: CurrentBoardService,
        private destroyed$: DestroyService
    ) {}

    ngOnInit(): void {
        this.tasks$ = this.currentBoard.currentBoard().pipe(
            switchMap((b) => this.taskService.get(b.boardId)),
            takeUntil(this.destroyed$)
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
