import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root',
})
export class CustomIconsService {
    constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {}

    init(): void {
        this.registerIcon('account', 'account');
        this.registerIcon('custom-add', 'custom-add');
        this.registerIcon('edit', 'edit');
    }

    private registerIcon(name: string, filename: string) {
        this.matIconRegistry.addSvgIcon(
            name,
            this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${filename}.svg`)
        );
    }
}
