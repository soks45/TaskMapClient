import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomIconsService } from '@services/custom-icons.service';

@Component({
    selector: 'tm-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(private icons: CustomIconsService, private router: Router) {
        this.icons.init();
    }

    ngOnInit(): void {
        this.router.navigate(['board-page']);
    }
}
