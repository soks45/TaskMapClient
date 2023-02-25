import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { AuthedHeaderComponent } from './authed-header.component';

@NgModule({
    declarations: [AuthedHeaderComponent],
    imports: [CommonModule, RouterLinkActive, RouterLinkWithHref, MatTabsModule, MatIconModule],
    exports: [AuthedHeaderComponent],
})
export class AuthedHeaderModule {}
