import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Board } from '@models/board';
import { TaskB } from '@models/task-b';
import { BoardService } from '@services/board/board.service';
import { TaskService } from '@services/task/task.service';
import { combineLatest, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

interface BoardWithTasks extends Board {
    tasks: TaskB[];
}

@Component({
    selector: 'tm-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    boards$?: Observable<BoardWithTasks[]>;

    constructor(private boardService: BoardService, private tasks: TaskService) {}

    ngOnInit(): void {
        this.boards$ = this.boardService.get().pipe(
            switchMap((boards) =>
                combineLatest(
                    boards.map((board) =>
                        this.tasks.get(board.boardId).pipe(
                            map((tasks) => ({
                                ...board,
                                tasks,
                            }))
                        )
                    )
                )
            )
        );
    }

    drop($event: CdkDragDrop<TaskB[]>) {
        if ($event.previousContainer === $event.container) {
            moveItemInArray($event.container.data, $event.previousIndex, $event.currentIndex);
        } else {
            transferArrayItem(
                $event.previousContainer.data,
                $event.container.data,
                $event.previousIndex,
                $event.currentIndex
            );
        }
    }
}
