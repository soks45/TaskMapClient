import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'tm-task-map',
    templateUrl: './task-map.component.html',
    styleUrls: ['./task-map.component.scss'],
    standalone: true,
    imports: [MatIconModule],
})
export class TaskMapComponent {}
