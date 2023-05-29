import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CurrentBoardDataSource } from '@services/data-sources/current-board.data-source';
import { BoardComponent } from '@ui/board/board.component';
import { PageRoutes } from 'app/app.routes';
import { DestroyService } from 'app/helpers/destroy.service';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'tm-board-page',
    templateUrl: './board-page.component.html',
    styleUrls: ['./board-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [BoardComponent, RouterOutlet, RouterLink],
    providers: [DestroyService],
})
export default class BoardPageComponent implements OnInit {
    constructor(
        private router: Router,
        private currentBoard: CurrentBoardDataSource,
        private destroyed$: DestroyService
    ) {}

    ngOnInit(): void {
        const url = this.router.routerState.snapshot.url;
        const idString = url.replace('/' + PageRoutes.boardPageRoute, '').replace('/', '');

        if (!idString) {
            this.navigateToLastBoard();
        }

        if (Number(idString) < 0 || !Number.isSafeInteger(Number(idString))) {
            this.navigateToLastBoard();
        }
    }

    private navigateToLastBoard(): void {
        this.currentBoard
            .getData()
            .pipe(takeUntil(this.destroyed$))
            .subscribe((board) => this.router.navigate([PageRoutes.boardPageRoute, board.boardId]));
    }
}
