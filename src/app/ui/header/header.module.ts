import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MatButtonModule } from '@angular/material/button';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { ProfileMultiselectMenuButtonComponent } from './header-menu/profile-multiselect-menu-button/profile-multiselect-menu-button.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { BoardsMultiselectMenuButtonComponent } from './header-menu/boards-multiselect-menu-button/boards-multiselect-menu-button.component';



@NgModule({
  declarations: [
    HeaderComponent,
    HeaderMenuComponent,
    ProfileMultiselectMenuButtonComponent,
    BoardsMultiselectMenuButtonComponent
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
    MatMenuModule
  ]
})
export class HeaderModule { }
