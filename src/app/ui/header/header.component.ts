import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { BaseObject } from '@mixins/mixins';
import { Board } from '@models/board';
import { User } from '@models/user';
import { AuthService } from '@services/auth.service';
import { CurrentBoardService } from '@services/board/current-board.service';
import { LoginFormDialogComponent } from '@ui/header/login-form-dialog/login-form-dialog.component';
import { SignUpFormDialogComponent } from '@ui/header/sign-up-form-dialog/sign-up-form-dialog.component';
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

    constructor(
        private router: Router,
        private lastBoardService: CurrentBoardService,
        private auth: AuthService,
        private dialog: MatDialog
    ) {
        super();
        this.currentBoard$ = this.lastBoardService.currentBoard$;
        this.user$ = this.auth.user$;

        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                this.route = this.router.url;
            }
        });
    }

    onLogin(): void {
        if (this.router.url !== 'board-page') {
            this.router.navigate(['board-page']);
        }
        const dialog = this.dialog.open(LoginFormDialogComponent, {
            closeOnNavigation: true,
            backdropClass: 'std-dialog-backdrop',
            panelClass: 'std-dialog-panel',
        });
    }

    onSignup(): void {
        if (this.router.url !== 'board-page') {
            this.router.navigate(['board-page']);
        }

        const dialog = this.dialog.open(SignUpFormDialogComponent);
    }
}
