import { Component, Input } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgFor, TitleCasePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

export interface NavTabItem {
    link: string;
    title: string;
}

@Component({
    selector: 'tm-nav-tabs',
    templateUrl: './nav-tabs.component.html',
    styleUrls: ['./nav-tabs.component.scss'],
    standalone: true,
    imports: [MatTabsModule, NgFor, RouterLinkActive, RouterLink, TitleCasePipe],
})
export class NavTabsComponent {
    @Input() items: NavTabItem[] = [];
    @Input() activeLinkClassNames: string[] = [];
}
