import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'tm-not-found',
    templateUrl: './not-found-page.component.html',
    styleUrls: ['./not-found-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export default class NotFoundPageComponent {}
