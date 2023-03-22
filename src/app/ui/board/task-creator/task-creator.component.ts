import { animate, state, style, transition, trigger } from '@angular/animations';
import { Point, CdkDragHandle } from '@angular/cdk/drag-drop';
import { DatePipe, NgIf, AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { TaskCreatorService } from '@services/task/task-creator.service';
import { TaskService } from '@services/task/task.service';
import { Color, TaskB } from 'app/models/task-b';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CardComponent } from '../card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'tm-task-creator [newPos]',
    templateUrl: './task-creator.component.html',
    styleUrls: ['./task-creator.component.scss'],
    providers: [DatePipe],
    animations: [
        trigger('smoothAppearance', [
            state('void', style({ opacity: 0.5 })),
            state('*', style({ opacity: 1 })),
            transition('void => *', animate(200)),
            transition('* => void', animate(100)),
        ]),
    ],
    standalone: true,
    imports: [MatButtonModule, CdkDragHandle, MatIconModule, NgIf, CardComponent, AsyncPipe],
})
export class TaskCreatorComponent extends DestroyMixin(BaseObject) {
    @Input() newPos!: Point;
    isLoading: boolean = false;
    isShowing: boolean = true;
    colorType = Color;
    creatorTask$: Observable<TaskB>;

    constructor(private taskService: TaskService, private taskCreator: TaskCreatorService) {
        super();

        this.creatorTask$ = this.taskCreator.creatorTask$;
    }

    changeColor(color: Color): void {
        this.taskCreator.edit({ color: color });
    }

    onCreate(creatorTask: TaskB): void {
        this.taskService
            .add({ ...creatorTask, ...this.newPos })
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => (this.isShowing = !this.isShowing));
    }
}
