import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { AuthService } from '@services/auth.service';
import { CacheService } from '@services/cache.service';
import { CustomIconsService } from '@services/custom-icons.service';
import { BoardsDataSource } from '@services/data-sources/boards.data-source';
import { CurrentBoardDataSource } from '@services/data-sources/current-board.data-source';
import { UserDataSource } from '@services/data-sources/user-data-source';
import { UsersDataSource } from '@services/data-sources/users-data-source';
import { HeaderComponent } from '@ui/header/header.component';
import { distinctUntilChanged, filter, skip } from 'rxjs';

@Component({
    selector: 'tm-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [LoadingBarModule, RouterOutlet, HeaderComponent],
})
export class AppComponent {
    constructor(
        private icons: CustomIconsService,
        private authService: AuthService,
        private cacheService: CacheService,
        private boardsService: BoardsDataSource,
        private currentBoardService: CurrentBoardDataSource,
        private userService: UserDataSource,
        private usersService: UsersDataSource
    ) {
        this.icons.init();

        this.cacheService.register(this.boardsService);
        this.cacheService.register(this.currentBoardService);
        this.cacheService.register(this.userService);
        this.cacheService.register(this.usersService);

        this.authService.isAuthed$
            .pipe(skip(1), distinctUntilChanged(), filter(Boolean), takeUntilDestroyed())
            .subscribe(() => this.cacheService.reloadAll());
    }
}
