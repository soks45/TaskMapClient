import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { BoardService } from '@services/board/board.service';
import { CreateBoardDialogComponent } from '@ui/dialogs/create-board-dialog/create-board-dialog.component';
import { PageRoutes } from '../../../app.routes';

@Component({
    selector: 'tm-boards-menu',
    standalone: true,
    imports: [CommonModule, MatMenuModule, MatDialogModule, MatIconModule],
    templateUrl: './boards-menu.component.html',
    styleUrls: ['./boards-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardsMenuComponent {
    @ViewChild('boardsMenu') menu!: MatMenu;

    constructor(public boardsService: BoardService, private dialog: MatDialog) {}

    onCreateNewBoard(): void {
        this.dialog.open(CreateBoardDialogComponent, { closeOnNavigation: true });
    }

    protected readonly PageRoutes = PageRoutes;
}
