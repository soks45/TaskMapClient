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
    avatar: string;
}

export interface User extends ShortUser {}
