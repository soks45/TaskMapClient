import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from "@angular/material/menu";
import { Observable, Subject, Subscription } from "rxjs";
import { TaskCreateDialogComponent } from "src/app/ui/board/task-create-dialog/task-create-dialog.component";
import { TaskB } from "src/models/task-b";
import { MatDialog } from '@angular/material/dialog';
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent /*implements OnInit, OnDestroy*/ {
  /*events: Observable<MouseEvent>;
  subscription?: Subscription;

  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger?: MatMenuTrigger;
  menuTopLeftPosition =  {x: `0`, y: `0`};

  constructor(
    private dialog: MatDialog,
    private boardService: BoardService
  ) {
    this.events = this.boardService.events.asObservable()
  }

  ngOnInit(): void {
    this.subscription = this.events.subscribe(event => {
      event.preventDefault();
      this.menuTopLeftPosition.x = event.clientX + 'px';
      this.menuTopLeftPosition.y = event.clientY + 'px';
      if (this.matMenuTrigger)
        this.matMenuTrigger.openMenu();
    })
  }

  createTask(): void {
    const dialog = this.dialog.open(TaskCreateDialogComponent, {
      panelClass: 'std-dialog-panel',
      backdropClass: 'std-dialog-backdrop231',
      disableClose: true,
      closeOnNavigation: true,
      data: {
        template: <TaskB> {
          coordinates: {
            x: parseInt(this.menuTopLeftPosition.x),
            y: parseInt(this.menuTopLeftPosition.y)
          }
        }
      },
    });

    dialog.afterClosed().subscribe((response) => {
      if (response) {
        console.log(response);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }*/
}
