import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GuardsCheckEnd, Router, RouterOutlet } from '@angular/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { CustomIconsService } from '@services/custom-icons.service';
import { HeaderComponent } from '@ui/header/header.component';
import { PageRoutes } from 'app/app.routes';
import { DestroyService } from 'app/helpers/destroy.service';
import { filter, takeUntil } from 'rxjs';

@Component({
    selector: 'tm-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [LoadingBarModule, RouterOutlet, HeaderComponent],
    providers: [DestroyService],
})
export class AppComponent {
    constructor(private icons: CustomIconsService, private router: Router, private destroy$: DestroyService) {
        this.icons.init();

        this.router.events
            .pipe(
                filter((event: any) => event instanceof GuardsCheckEnd),
                takeUntil(this.destroy$)
            )
            .subscribe((event: GuardsCheckEnd) => {
                if (!event.shouldActivate) {
                    this.router.navigate([PageRoutes.notFoundPageRoute]);
                }
            });
    }
}
