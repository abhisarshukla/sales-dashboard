import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

type GetErrorFunctions = {
  firstname: () => string;
  lastname: () => string;
  email: () => string;
  password: () => string;
  confirmpassword: () => string;
};

@Component({
  selector: 'app-auth-signup',
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.css'],
})
export class AuthSignUpComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  private userSub: Subscription;
  private signupSub: Subscription;
  hideConfirmPassword = true;
  hidePassword = true;
  getErrorFunctions: GetErrorFunctions;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    });
    this.signupForm = new FormGroup({
      firstname: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastname: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmpassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
    this.signupForm
      .get('confirmpassword')
      .addValidators(this.exactMatchValidator(this.signupForm.get('password')));

    this.getErrorFunctions = {
      firstname: (): string => {
        const control = this.signupForm.get('firstname');
        if (control.hasError('required')) {
          return 'You must enter a value!';
        } else if (control.hasError('minlength')) {
          return 'First name length should be more than 1 character!';
        } else {
          return '';
        }
      },
      lastname: (): string => {
        const control = this.signupForm.get('lastname');
        if (control.hasError('required')) {
          return 'You must enter a value!';
        } else if (control.hasError('minlength')) {
          return 'Last name length should be more than 1 character!';
        } else {
          return '';
        }
      },
      email: (): string => {
        const control = this.signupForm.get('email');
        if (control.hasError('required')) {
          return 'You must enter a value!';
        } else if (control.hasError('email')) {
          return 'Not a valid email!';
        } else {
          return '';
        }
      },
      password: (): string => {
        const control = this.signupForm.get('password');
        if (control.hasError('required')) {
          return 'You must enter a password!';
        } else if (control.hasError('minlength')) {
          return 'Password size must be more than 8 characters!';
        } else {
          return '';
        }
      },
      confirmpassword: (): string => {
        const control = this.signupForm.get('confirmpassword');
        if (control.hasError('required')) {
          return 'You must re-enter the password!';
        } else if (control.hasError('minlength')) {
          return 'Password size must be more than 8 characters!';
        } else if (control.hasError('notExactMatch')) {
          return 'Passwords do not match!';
        } else {
          return '';
        }
      },
    };
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.signupSub?.unsubscribe();
  }

  onSubmit() {
    if (!this.signupForm.valid) {
      return;
    }
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;
    const firstname = this.signupForm.value.firstname;
    const lastname = this.signupForm.value.lastname;

    this.isLoading = true;

    this.signupSub = this.authService
      .signup(email, password, firstname, lastname)
      .subscribe({
        next: (resData) => {
          this.router.navigate(['/dashboard']);
          this.isLoading = false;
          this.error = null;
        },
        error: (errorMessage) => {
          this.error = errorMessage;
          this.isLoading = false;
        },
      });
  }

  exactMatchValidator(targetControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (targetControl.value !== control.value) {
        return { notExactMatch: 'Two fields do not match.' };
      } else {
        return null;
      }
    };
  }
}
