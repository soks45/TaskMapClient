import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLinkActive, RouterLinkWithHref, RouterModule } from '@angular/router';
import { NavTabsComponent } from './nav-tabs.component';

@NgModule({
    declarations: [NavTabsComponent],
    imports: [CommonModule, MatTabsModule, RouterLinkActive, RouterLinkWithHref, RouterModule],
    exports: [NavTabsComponent],
})
export class NavTabsModule {}
