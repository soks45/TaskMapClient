import { Component } from '@angular/core';
import { GuardsCheckEnd, Router, RouterOutlet } from '@angular/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { CustomIconsService } from '@services/custom-icons.service';
import { HeaderComponent } from '@ui/header/header.component';
import { PageRoutes } from 'app/app-routing.module';
import { filter } from 'rxjs';

@Component({
    selector: 'tm-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [LoadingBarModule, RouterOutlet, HeaderComponent],
})
export class AppComponent {
    constructor(private icons: CustomIconsService, private router: Router) {
        this.icons.init();

        this.router.events
            .pipe(filter((event: any) => event instanceof GuardsCheckEnd))
            .subscribe((event: GuardsCheckEnd) => {
                if (!event.shouldActivate) {
                    this.router.navigate([PageRoutes.notFoundPageRoute]);
                }
            });
    }
}
