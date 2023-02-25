import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root',
})
export class CustomIconsService {
    constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {}

    init(): void {
        this.registerIcon('account');
        this.registerIcon('custom-add');
        this.registerIcon('edit');
        this.registerIcon('logo');
    }

    private registerIcon(name: string) {
        this.matIconRegistry.addSvgIcon(
            name,
            this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${name}.svg`)
        );
    }
}
