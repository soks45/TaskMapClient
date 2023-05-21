import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CurrentBoardService } from '@services/board/current-board.service';
import { BoardComponent } from '@ui/board/board.component';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'tm-board-page',
    templateUrl: './board-page.component.html',
    styleUrls: ['./board-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [BoardComponent, RouterOutlet],
})
export default class BoardPageComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router, private currentBoard: CurrentBoardService) {}

    ngOnInit(): void {
        this.route.params.pipe(tap(console.log)).subscribe();
    }
}
