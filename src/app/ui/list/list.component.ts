import { Component, Input } from '@angular/core';

@Component({
    selector: 'tm-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent {
    @Input() header = '';
}
