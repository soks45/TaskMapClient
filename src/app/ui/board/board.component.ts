import { animate, state, style, transition, trigger } from '@angular/animations';
import { Point } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { CurrentBoardService } from '@services/board/current-board.service';
import { TaskService } from '@services/task/task.service';
import { InitItemPosition } from '@ui/adaptive-drag/adaptive-drag.component';
import { TaskB } from 'app/models/task-b';
import { Observable, takeUntil, tap } from 'rxjs';

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
})
export class BoardComponent extends DestroyMixin(BaseObject) {
    tasks$?: Observable<TaskB[]>;
    boundaryClassName = 'board';

    constructor(private taskService: TaskService, private currentBoard: CurrentBoardService) {
        super();

        this.currentBoard
            .currentBoard()
            .pipe(
                takeUntil(this.destroyed$),
                tap((b) => (this.tasks$ = this.taskService.get(b.boardId)))
            )
            .subscribe();
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
