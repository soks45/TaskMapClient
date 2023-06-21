import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { ConfirmService } from '@services/confirm.service';
import { BoardsDataSource } from '@services/data-sources/boards.data-source';
import { CurrentBoardDataSource } from '@services/data-sources/current-board.data-source';
import { CreateBoardDialogComponent } from '@ui/dialogs/create-board-dialog/create-board-dialog.component';
import { ShareBoardDialogComponent } from '@ui/dialogs/share-board-dialog/share-board-dialog.component';
import { PageRoutes } from 'app/app.routes';
import { Board } from 'app/models/board';
import { of, switchMap } from 'rxjs';

@Component({
    selector: 'tm-boards-menu',
    standalone: true,
    imports: [CommonModule, MatMenuModule, MatDialogModule, MatIconModule, RouterLink, MatButtonModule],
    templateUrl: './boards-menu.component.html',
    styleUrls: ['./boards-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardsMenuComponent {
    @ViewChild('boardsMenu') menu!: MatMenu;

    constructor(
        public boardsService: BoardsDataSource,
        private dialog: MatDialog,
        private router: Router,
        private currentBoard: CurrentBoardDataSource,
        private confirmService: ConfirmService
    ) {}

    onCreateNewBoard(event: MouseEvent): void {
        event.stopPropagation();
        event.preventDefault();

        this.dialog.open(CreateBoardDialogComponent, { closeOnNavigation: true });
    }

    onBoardClick(board: Board): void {
        this.currentBoard.switchBoard(board.boardId).subscribe(() => this.router.navigate([PageRoutes.boardPageRoute]));
    }

    onShare(event: Event, board: Board): void {
        event.stopPropagation();
        event.preventDefault();

        this.dialog.open(ShareBoardDialogComponent, {
            closeOnNavigation: true,
            data: board,
        });
    }

    onUnShare(event: Event, board: Board) {
        event.stopPropagation();
        event.preventDefault();

        this.confirmService
            .confirm({
                title: 'unshare board',
                question: `Are you sure you want to unshare this board ${board.boardName}`,
            })
            .pipe(switchMap((confirmation: boolean) => (confirmation ? this.boardsService.unShare(board) : of(void 0))))
            .subscribe();
    }
}
