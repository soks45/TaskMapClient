import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  currentBoard: number;
  constructor() {
    this.currentBoard = 0;
  }
}
