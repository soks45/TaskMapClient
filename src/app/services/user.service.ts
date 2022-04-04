import { Injectable } from '@angular/core';
import { User } from "src/models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: User[]
  constructor() {
    this.users = [
      {
        userId: 0,
        email: 'ab@mail.ru',
        firstName: 'Alek',
        lastName: 'FAM',
        avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
      },
      {
        userId: 1,
        email: 'aaaab@mail.ru',
        firstName: 'Alaek',
        lastName: 'FdwaAM',
        avatar: 'https://cdnn21.img.ria.ru/images/155246/09/1552460957_58:0:2787:2047_1920x0_80_0_0_c679b04b6c1bd38634c28c150715e10e.jpg',
      }
    ]
  }
}
