import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { DeepReadOnly } from '@models/deep-read-only';
import { TaskB } from '@models/task-b';
import { BoardViewService } from '@pages/board-page/components/board/board-view.service';
import {
    EditCardDialogComponent,
    EditDialogData,
} from '@pages/board-page/components/board/edit-card-dialog/edit-card-dialog.component';
import { TaskService } from '@services/task/task.service';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'tm-card [task] ',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent extends DestroyMixin(BaseObject) implements OnInit {
    readonly cardSize: DeepReadOnly<Point> = {
        x: 210,
        y: 260,
    };

    @Input() task!: TaskB;
    @Input() boundaryClassName?: string;
    @Input() fromCreator: boolean = false;

    position: Point = {
        x: 0,
        y: 0,
    };
    relativePositions$: Subject<Point> = new Subject<Point>();

    constructor(private taskService: TaskService, private dialog: MatDialog, private boardView: BoardViewService) {
        super();

        this.boardView
            .positions(this.cardSize, this.relativePositions$)
            .pipe(
                takeUntil(this.destroyed$),
                tap((newPosition) => (this.position = newPosition))
            )
            .subscribe();
    }

    ngOnInit(): void {
        this.relativePositions$.next({
            x: this.task.x,
            y: this.task.y,
        });
    }

    deleteTask(): void {
        if (this.fromCreator) {
            return;
        }

        this.taskService.delete(this.task).subscribe();
    }

    editTask(): void {
        this.dialog.open(EditCardDialogComponent, {
            closeOnNavigation: true,
            data: <EditDialogData>{
                task: this.task,
                isAuthed: true,
                fromCreator: this.fromCreator,
            },
        });
    }

    onDnDEnd($event: CdkDragEnd): void {
        const newRelativePosition = this.boardView.absoluteToRelative($event.source._dragRef.getFreeDragPosition());
        [this.task.x, this.task.y] = [newRelativePosition.x, newRelativePosition.y];
        this.relativePositions$.next(newRelativePosition);
        this.taskService.edit(this.task, false).subscribe();
    }
}
