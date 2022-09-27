import { Component, Input } from '@angular/core';
import { Board } from '@models/board';
import { TaskB } from '@models/task-b';
import { TaskService } from '@services/task.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'tm-board [Board]',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
    tasks$: Observable<TaskB[]>;
    @Input() Board!: Board;

    constructor(private taskService: TaskService) {
        this.tasks$ = this.taskService.content$;
    }

    contextMenu(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
    }
}
