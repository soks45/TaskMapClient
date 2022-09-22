import { Component } from '@angular/core';
import { CustomIconsService } from 'src/app/services/custom-icons.service';

@Component({
    selector: 'tm-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(private icons: CustomIconsService) {
        this.icons.init();
    }
}
