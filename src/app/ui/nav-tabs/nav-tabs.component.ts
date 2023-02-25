import { Component, Input } from '@angular/core';

export interface NavTabItem {
    link: string;
    title: string;
}

@Component({
    selector: 'tm-nav-tabs',
    templateUrl: './nav-tabs.component.html',
    styleUrls: ['./nav-tabs.component.scss'],
})
export class NavTabsComponent {
    @Input() items: NavTabItem[] = [];
    @Input() activeLinkClassNames: string[] = [];
}
