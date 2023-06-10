import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { defaultPageRoute } from 'app/app.routes';

@Component({
    selector: 'tm-not-found',
    templateUrl: './not-found-page.component.html',
    styleUrls: ['./not-found-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatButtonModule, NgOptimizedImage, RouterLink],
})
export default class NotFoundPageComponent {
    protected readonly defaultPageRoute = '/' + defaultPageRoute;
}
