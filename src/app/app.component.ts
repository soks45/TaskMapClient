import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { CustomIconsService } from '@services/custom-icons.service';
import { HeaderComponent } from '@ui/header/header.component';

@Component({
    selector: 'tm-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [LoadingBarModule, RouterOutlet, HeaderComponent],
})
export class AppComponent {
    constructor(private icons: CustomIconsService) {
        this.icons.init();
    }
}
