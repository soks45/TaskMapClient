export interface InputUser {
    username: string;
    firstName: string;
    lastName: string;
}

export interface ShortUser {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    lastBoardId: number;
}

export interface User extends ShortUser {}
