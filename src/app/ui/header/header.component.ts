import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { Board } from '@models/board';
import { ShortUser } from '@models/user';
import { AuthService } from '@services/auth.service';
import { BoardService } from '@services/board.service';
import { Observable, takeUntil } from 'rxjs';

@Component({
    selector: 'tm-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends DestroyMixin(BaseObject) implements OnInit {
    route?: string;
    currentBoard?: Board;
    user$: Observable<ShortUser | null>;

    constructor(private router: Router, private boardService: BoardService, private auth: AuthService) {
        super();
        this.user$ = this.auth.user$;
    }

    ngOnInit(): void {
        this.boardService.currentBoard$.pipe(takeUntil(this.destroyed$)).subscribe((board) => (this.currentBoard = board));

        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                this.route = this.router.url;
            }
        });
    }
}
