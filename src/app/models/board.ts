export interface Board {
    boardId: number;
    userId: number;
    createdDate: string;
    boardName: string;
    boardDescription: string;
    accessRights: AccessRights;
    isShared: boolean;
}

export enum AccessRights {
    readOnly = 'read-only',
    editAccess = 'edit-access',
    administrating = 'administrating',
}
