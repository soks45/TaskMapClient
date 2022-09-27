import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

enum MessageType {
    success = 'success',
    error = 'error',
    info = 'info',
}

@Injectable({
    providedIn: 'root',
})
export class MessagesService {
    constructor(private matSnackBar: MatSnackBar) {}

    success(message: string): void {
        this.show(message, 'Cool!', MessageType.success);
    }

    error(message: string): void {
        this.show(message, 'Oh...', MessageType.error);
    }

    info(message: string): void {
        this.show(message, 'Ok', MessageType.info);
    }

    private show(message: string, action: string, type: MessageType): void {
        this.matSnackBar.open(message, action, {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: [`mat-snack-bar-container--${type}`],
        });
    }
}
