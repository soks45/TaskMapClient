import { Moment } from 'moment';
import { ChartModel } from 'src/models/chart-model';

enum State {
  Main,
  Short,
}

export interface ShortTaskB {
  taskId: number,
  boardId: number,
  coordinates: ChartModel,
}

export interface TaskB extends ShortTaskB {
  userId: number,
  createdDate: string,
  taskLabel: string,
  taskText: string,
  color: string,
  state: State
}

export interface TaskBServer {
  taskId: number,
  boardId: number,
  coordinates: string,
  userId: number,
  createdDate: string,
  taskLabel: string,
  taskText: string,
  color: string,
  state: State
}
