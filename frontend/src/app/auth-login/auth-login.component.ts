import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css'],
})
export class AuthLoginComponent implements OnInit, OnDestroy {
  @ViewChild('loginForm') loginForm: NgForm;
  private userSub: Subscription;
  private loginSub: Subscription;
  error = null;
  isLoading = false;
  hide = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.loginSub?.unsubscribe();
  }

  getEmailErrorMessage() {
    if (this.loginForm.form.controls['email'].hasError('required')) {
      return 'You must enter a value!';
    } else if (this.loginForm.form.controls['email'].hasError('email')) {
      return 'Not a valid email!';
    } else {
      return '';
    }
  }

  getPasswordErrorMessage() {
    if (this.loginForm.form.controls['password'].hasError('required')) {
      return 'You must enter a password!';
    } else if (this.loginForm.form.controls['password'].hasError('minlength')) {
      return 'Password size must be more than 8 characters!';
    } else {
      return '';
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    this.loginSub = this.authService.login(email, password).subscribe({
      next: (resData) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
        this.error = null;
      },
      error: (errorMessage) => {
        this.isLoading = false;
        this.error = errorMessage;
      },
    });
  }
}
