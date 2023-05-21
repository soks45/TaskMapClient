import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { BoardService } from '@services/board/board.service';
import { CreateBoardDialogComponent } from '@ui/dialogs/create-board-dialog/create-board-dialog.component';
import { PageRoutes } from 'app/app.routes';
import { Board } from 'app/models/board';

@Component({
    selector: 'tm-boards-menu',
    standalone: true,
    imports: [CommonModule, MatMenuModule, MatDialogModule, MatIconModule, RouterLink, NgFor],
    templateUrl: './boards-menu.component.html',
    styleUrls: ['./boards-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardsMenuComponent {
    @ViewChild('boardsMenu') menu!: MatMenu;

    constructor(public boardsService: BoardService, private dialog: MatDialog, private router: Router) {}

    onCreateNewBoard(): void {
        this.dialog.open(CreateBoardDialogComponent, { closeOnNavigation: true });
    }

    onBoardClick(board: Board) {
        this.router.navigate([PageRoutes.boardPageRoute, board.boardId]);
    }
}
