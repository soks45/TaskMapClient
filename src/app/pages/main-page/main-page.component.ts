import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
import { TaskService } from 'src/app/services/task.service';
import { Board } from 'src/models/board';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  Boards: Board[] = [];
  currentBoardId: number = 1;

  constructor(
    private boardsService: BoardService,
    private taskService: TaskService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.boardsService.userBoards$.subscribe((boards) => {
      this.Boards = boards;
      console.log('boards - ', this.Boards);
    });
    this.boardsService.currentBoardId$.subscribe((res) => {
      this.currentBoardId = res;
      console.log('currentBoardId', this.currentBoardId);
    });
  }

  onSwitchBoard1(): void {
    this.taskService.switchBoard(1);
  }

  onSwitchBoard2(): void {
    this.taskService.switchBoard(2);
  }

  onGetBoard(): void {
    this.boardsService.getBoard();
  }

  onAddBoard(): void {
    const board: Board = {
      boardId: 2,
      boardName: 'board2',
      boardDescription: 'some description',
      state: 0,
      userId: this.authService.user.userId,
      createdDate: JSON.stringify(formatDate(new Date(), 'yyyy/MM/dd', 'en'))
    }
    this.boardsService.addBoard(board);
  }

  onDeleteBoard(): void {
    this.boardsService.deleteBoard(1);
  }

  onEditBoard(): void {
    const board: Board = {
      boardId: 2,
      boardName: 'board222222222',
      boardDescription: 'SOME description',
      state: 0,
      userId: this.authService.user.userId,
      createdDate: JSON.stringify(formatDate(new Date(), 'yyyy/MM/dd', 'en'))
    }
    this.boardsService.editBoard(board);
  }
}
