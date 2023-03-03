import { Component } from '@angular/core';
import { GuardsCheckEnd, Router } from '@angular/router';
import { CustomIconsService } from '@services/custom-icons.service';
import { PageRoutes } from 'app/app-routing.module';
import { filter } from 'rxjs';

@Component({
    selector: 'tm-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
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
