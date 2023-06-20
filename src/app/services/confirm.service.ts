import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    ConfirmDialogComponent,
    ConfirmDialogConfiguration,
} from '@ui/dialogs/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ConfirmService {
    constructor(private dialog: MatDialog) {}

    confirm(data: ConfirmDialogConfiguration): Observable<boolean> {
        return this.dialog
            .open<ConfirmDialogComponent, ConfirmDialogConfiguration, boolean>(ConfirmDialogComponent, {
                data,
            })
            .afterClosed()
            .pipe(map(Boolean));
    }
}
