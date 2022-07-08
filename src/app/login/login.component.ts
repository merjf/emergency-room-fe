import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  message: any;

  constructor(private authService: AuthService, private storageService: StorageService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as {data?: string};
    this.message = state?.data;
  }

  ngOnInit(): void {
    if (this.storageService.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getCurrentUser().roles;
    }
  }

  login(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe(
      data => {
        this.storageService.saveToken(data.token);
        this.storageService.saveCurrentUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getCurrentUser().roles;
        this.router.navigate(['profile']).then(() => {
          window.location.reload();
        });;
      },
      err => {
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}