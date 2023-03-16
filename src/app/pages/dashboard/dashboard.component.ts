import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Board } from '@models/board';
import { TaskB } from '@models/task-b';
import { BoardService } from '@services/board/board.service';
import { TaskService } from '@services/task/task.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'tm-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    boards$?: Observable<Board[]>;

    constructor(private boards: BoardService, public tasks: TaskService) {}

    ngOnInit(): void {
        this.boards$ = this.boards.get();
    }

    drop($event: CdkDragDrop<TaskB[]>, tasks: TaskB[]) {
        moveItemInArray(tasks, $event.previousIndex, $event.currentIndex);
    }
}
