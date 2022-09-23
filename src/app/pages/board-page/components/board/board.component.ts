import { Component, Input } from '@angular/core';
import { TaskService } from '@services/task-service';
import { Board } from '@models/board';
import { TaskB } from '@models/task-b';

@Component({
    selector: 'tm-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
    tasks: TaskB[];
    @Input() Board: Board | null = null;

    constructor(private taskService: TaskService) {
        this.tasks = this.taskService.tasks;
    }

    contextMenu(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
    }
}
