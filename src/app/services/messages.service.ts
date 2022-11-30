import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

enum MessageType {
    success = 'success',
    error = 'error',
    info = 'info',
}

interface ErrorObject {
    message: string;
}

@Injectable({
    providedIn: 'root',
})
export class MessagesService {
    constructor(private matSnackBar: MatSnackBar) {}

    success(message: string, action: string = '=)'): void {
        this.show(message, action, MessageType.success);
    }

    error(error: string | ErrorObject, action: string = 'Oh...'): void {
        if (typeof error === 'object') {
            this.show(error.message, action, MessageType.error);
            return;
        }

        this.show(error, action, MessageType.error);
    }

    info(message: string, action: string = 'Ok'): void {
        this.show(message, action, MessageType.info);
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
