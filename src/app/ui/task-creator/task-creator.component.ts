import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDragHandle, Point } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskCreatorDataSource } from '@ui/task-creator/task-creator.data-source';
import { TasksService } from '@services/tasks.service';
import { DestroyService } from 'app/helpers/destroy.service';
import { Color, TaskB } from 'app/models/task-b';
import { CardComponent } from 'app/ui/card/card.component';
import { Observable, tap } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'tm-task-creator [newPos]',
    templateUrl: './task-creator.component.html',
    styleUrls: ['./task-creator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    providers: [DestroyService],
})
export class TaskCreatorComponent {
    @Input() newPos!: Point;
    isLoading: boolean = false;
    isShowing: boolean = true;
    colorType = Color;
    creatorTask$: Observable<TaskB>;

    constructor(private taskService: TasksService, private taskCreator: TaskCreatorDataSource) {
        this.creatorTask$ = this.taskCreator.getData().pipe(tap(console.log));
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
