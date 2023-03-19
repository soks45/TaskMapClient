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
    x: number;
    y: number;
}

export interface TaskB extends ShortTaskB {
    next_task_id: number;
    userId: number;
    createdDate: string;
    taskLabel: string;
    taskText: string;
    color: Color;
    state: State;
}
