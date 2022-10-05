import { ChartModel } from '@models/chart-model';

export enum State {
    Main,
    Short,
}

export enum Color {
    Purple = 'purple',
    Green = 'green',
    Red = 'red',
}

export const States = Object.values(State);
export const Colors = Object.values(Color);

export interface ShortTaskB {
    taskId: number;
    boardId: number;
    coordinates: ChartModel;
}

export interface TaskB extends ShortTaskB {
    userId: number;
    createdDate: string;
    taskLabel: string;
    taskText: string;
    color: Color;
    state: State;
}

export interface TaskBServer {
    taskId: number;
    boardId: number;
    coordinates: string;
    userId: number;
    createdDate: string;
    taskLabel: string;
    taskText: string;
    color: string;
    state: State;
}
