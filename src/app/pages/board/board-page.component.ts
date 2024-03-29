import { Component } from '@angular/core';
import { BoardComponent } from '@ui/board/board.component';

@Component({
    selector: 'tm-board-page',
    templateUrl: './board-page.component.html',
    styleUrls: ['./board-page.component.scss'],
    standalone: true,
    imports: [BoardComponent],
})
export default class BoardPageComponent {}
