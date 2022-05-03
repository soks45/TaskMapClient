import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MatButtonModule } from '@angular/material/button';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { ProfileMultiselectMenuButtonComponent } from './header-menu/profile-multiselect-menu-button/profile-multiselect-menu-button.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HeaderComponent,
    HeaderMenuComponent,
    ProfileMultiselectMenuButtonComponent
  ],
  exports: [
    HeaderComponent,
    HeaderMenuComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ]
})
export class HeaderModule { }
