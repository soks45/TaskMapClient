import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GoogleAuthBtnComponent } from './google-auth-btn.component';

@NgModule({
    declarations: [GoogleAuthBtnComponent],
    imports: [CommonModule],
    exports: [GoogleAuthBtnComponent],
})
export class GoogleAuthBtnModule {}
