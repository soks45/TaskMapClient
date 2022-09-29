import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { Board } from '@models/board';
import { User } from '@models/user';
import { AuthService } from '@services/auth.service';
import { CurrentBoardService } from '@services/current-board.service';
import { Observable, takeUntil } from 'rxjs';

@Component({
    selector: 'tm-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends DestroyMixin(BaseObject) {
    route: string = this.router.url;
    currentBoard$: Observable<Board>;
    user$: Observable<User | null>;

    constructor(private router: Router, private lastBoardService: CurrentBoardService, private auth: AuthService) {
        super();
        this.currentBoard$ = this.lastBoardService.currentBoard$;
        this.user$ = this.auth.user$;

        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                this.route = this.router.url;
            }
        });
    }
}
