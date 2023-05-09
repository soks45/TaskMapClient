import { NgFor, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavTabItem {
    link: string;
    title: string;
}

@Component({
    selector: 'tm-nav-tabs',
    templateUrl: './nav-tabs.component.html',
    styleUrls: ['./nav-tabs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatTabsModule, NgFor, RouterLinkActive, RouterLink, TitleCasePipe],
})
export class NavTabsComponent {
    @Input() items: NavTabItem[] = [];
    @Input() activeLinkClassNames: string[] = [];
}
