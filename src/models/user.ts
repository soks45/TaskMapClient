export interface ShortUser {
  userId: number,
  email: string,
  firstName: string,
  lastName: string,
  lastBoardId: number
}

export interface User extends ShortUser {

}

