import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { AfterViewInit, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { TaskB } from '@models/task-b';
import { Boundary } from '@pages/board-page/components/board/board.component';
import {
    EditCardDialogComponent,
    EditDialogData,
} from '@pages/board-page/components/board/edit-card-dialog/edit-card-dialog.component';
import { ConverterService } from '@services/converter.service';
import { TaskService } from '@services/task.service';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'tm-card [task] [boundary]',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent extends DestroyMixin(BaseObject) implements AfterViewInit {
    @Input() task!: TaskB;
    @Input() boundary!: Boundary;
    @Input() fromCreator: boolean = false;

    size: Point = {
        x: 0,
        y: 0,
    };
    position: Point = {
        x: 0,
        y: 0,
    };
    cardSize: Point = {
        x: 210,
        y: 260,
    };

    constructor(private taskService: TaskService, private dialog: MatDialog, private converter: ConverterService) {
        super();
    }

    ngAfterViewInit(): void {
        if (this.boundary.boundarySize) {
            this.boundary.boundarySize.pipe(takeUntil(this.destroyed$)).subscribe((newSize) => this.onResize(newSize));
        }
    }

    deleteTask(): void {
        if (this.fromCreator) {
            return;
        }

        this.taskService.delete(this.task).subscribe(); //TODO do some cool stuff here
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

    onDnDEnd(event: CdkDragEnd): void {
        this.newTaskPosition(event.source._dragRef.getFreeDragPosition());
    }

    private onResize(newSize: Point): void {
        this.size = newSize;
        this.setPosition();
    }

    private setPosition(): void {
        this.position = this.converter.fractionToPosition({ x: this.task.x, y: this.task.y }, this.size, this.cardSize);
    }

    private newTaskPosition(newPos: Point): void {
        const fraction = this.converter.positionToFraction(newPos, this.size);
        this.task.x = fraction.x;
        this.task.y = fraction.y;
        this.setPosition();
        this.taskService.edit(this.task, false).subscribe();
    }
}
