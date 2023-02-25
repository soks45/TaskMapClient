import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { AuthedHeaderModule } from '@ui/header/components/authed-header/authed-header.module';
import { HeaderComponent } from './header.component';

@NgModule({
    declarations: [HeaderComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatRippleModule,
        RouterModule,
        MatDialogModule,
        MatMenuModule,
        AuthedHeaderModule,
    ],
    exports: [HeaderComponent],
})
export class HeaderModule {}
