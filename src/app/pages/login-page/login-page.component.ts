import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth';
import { Subscription } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'task-map-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  username = '';
  password = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private logger: NGXLogger
  ) { }

  ngOnInit(): void {
  }

  onLogin(): void {
    if (!this.username || !this.password) {
      return;
    }
    this.authService
      .login(this.username, this.password)
      .subscribe(
        () => {
          this.router.navigate(['main-page']);
        },
        () => {
          this.router.navigate(['login']);
        }
      );
  }
}
