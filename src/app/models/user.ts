export interface InputUser {
    firstName: string;
    lastName: string;
}

export interface ShortUser {
    userId: number;
    username: string;
    avatar: string;
}

export interface User extends ShortUser {
    firstName: string;
    lastName: string;
}
