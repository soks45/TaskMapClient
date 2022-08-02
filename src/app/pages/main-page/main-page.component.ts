import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth';
import { BoardService } from 'src/app/services/board.service';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  constructor(private taskService: TaskService, private boardService: BoardService, private auth: AuthService) {
    this.auth.user$.subscribe(res => console.log('user$', res));
    this.taskService.tasks$.subscribe(res => console.log('tasks$', res));
    this.boardService.currentBoard$.subscribe(res => console.log('currentBoard$', res));
    this.boardService.boards$.subscribe(res => console.log('boards$', res));
  }

  getBoard(): void {
    this.boardService.getBoards().subscribe();
  }

  createBoard(): void {
    this.boardService.addBoard({
      boardId: 3,
      boardName: 'NAMEDDD',
      createdDate: 'dawt',
      userId: 2,
      boardDescription: 'descri[t'
    }).subscribe();
  }

  deleteBoard(): void {
    this.boardService.deleteBoard({
      boardId: 4,
      boardName: 'NAMEDDD',
      createdDate: 'dawt',
      userId: 2,
      boardDescription: 'descri[t'
    }).subscribe();
  }

  editBoard(): void {
    this.boardService.editBoard({
      boardId: 8,
      boardName: 'NAMED',
      createdDate: 'dawt',
      userId: 2,
      boardDescription: 'descri[t'
    }).subscribe();
  }

  switchBoard1(): void {
    this.boardService.switchBoard({
      boardId: 2,
      boardName: 'NAMEDDD',
      createdDate: 'dawt',
      userId: 2,
      boardDescription: 'descri[t'
    }).subscribe();
  }

  switchBoard2(): void {
    this.boardService.switchBoard({
      boardId: 2,
      boardName: 'NAMEDD',
      createdDate: 'dawt',
      userId: 2,
      boardDescription: 'descri[t'
    }).subscribe();
  }

  logBoard(): void {
    console.log(this.taskService.currentBoard);
  }

  addTask(): void {
    if (this.taskService.currentBoard)
      this.taskService.addTask({
        taskId: 0,
        userId: 2,
        coordinates: {
          x: 1,
          y: 3
        },
        boardId: this.taskService.currentBoard.boardId,
        state: 1,
        taskText: 'ddawda',
        createdDate: 'dwadawadw',
        color: 'red',
        taskLabel: 'label'
      }).subscribe();
  }

  editTask(): void {
    if (this.taskService.currentBoard)
      this.taskService.editTask({
        taskId: 10,
        userId: 2,
        coordinates: {
          x: -1,
          y: 0.123
        },
        boardId: this.taskService.currentBoard.boardId,
        state: 1,
        taskText: 'dawda',
        createdDate: 'dwadawadw',
        color: 'red',
        taskLabel: 'label'
      }).subscribe();
  }

  deleteTask1(): void {
    if (this.taskService.currentBoard)
      this.taskService.deleteTask({
        taskId: 10,
        userId: 2,
        coordinates: {
          x: -1,
          y: 0.123
        },
        boardId: 5,
        state: 1,
        taskText: 'ddawda',
        createdDate: 'dwadawadw',
        color: 'red',
        taskLabel: 'label'
      }).subscribe();
  }

  deleteTask2(): void {
    if (this.taskService.currentBoard)
      this.taskService.deleteTask({
        taskId: 11,
        userId: 2,
        coordinates: {
          x: -1,
          y: 0.123
        },
        boardId: this.taskService.currentBoard.boardId,
        state: 1,
        taskText: 'ddawda',
        createdDate: 'dwadawadw',
        color: 'red',
        taskLabel: 'label'
      }).subscribe();
  }
}
