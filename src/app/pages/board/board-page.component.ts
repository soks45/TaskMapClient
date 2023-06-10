import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CurrentBoardDataSource } from '@services/data-sources/current-board.data-source';
import { BoardComponent } from '@ui/board/board.component';
import { PageRoutes } from 'app/app.routes';

@Component({
    selector: 'tm-board-page',
    templateUrl: './board-page.component.html',
    styleUrls: ['./board-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [BoardComponent, RouterOutlet, RouterLink],
})
export default class BoardPageComponent implements OnInit {
    constructor(
        private router: Router,
        private currentBoard: CurrentBoardDataSource,
        private dr: DestroyRef,
        private route: ActivatedRoute
    ) {
        this.route.fragment.subscribe(console.log);
    }

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
            .pipe(takeUntilDestroyed(this.dr))
            .subscribe((board) => this.router.navigate([PageRoutes.boardPageRoute, board.boardId]));
    }
}
