import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core';
import { User } from 'src/models/user';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent implements OnInit {
  fName?: string;
  LName?: string;
  password?: string;
  password2?: string;
  email?: string;


  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  trySignUp(): void {
    if (!(this.fName && this.LName && this.password && this.email && (this.password === this.password2))) {
      return;
    }
    const user: User = {
      userId: 0,
      email: this.email,
      lastName: this.LName,
      firstName: this.fName
    }
    this.auth.signup(user, this.password);
  }

}
