import { TitleCasePipe } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../user.model';

export class ModalData {
  user: User;
  constructor() {
    this.user = new User();
  }
}

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css'],
})
export class UserModalComponent {
  @ViewChild('userForm') userForm: NgForm;
  hide: boolean = true;
  private titleCasePipe = new TitleCasePipe();
  constructor(
    public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {}

  getValidationErrorMessage(controlName: string) {
    if (this.userForm.form.controls[controlName].hasError('required')) {
      return this.titleCasePipe.transform(controlName) + ' is required!';
    } else {
      return '';
    }
  }

  getEmailErrorMessage() {
    if (this.userForm.form.controls['email'].hasError('required')) {
      return 'You must enter a value!';
    } else if (this.userForm.form.controls['email'].hasError('email')) {
      return 'Not a valid email!';
    } else {
      return '';
    }
  }

  getPasswordErrorMessage() {
    if (this.userForm.form.controls['password'].hasError('required')) {
      return 'You must enter a password!';
    } else if (this.userForm.form.controls['password'].hasError('minlength')) {
      return 'Password size must be more than 8 characters!';
    } else {
      return '';
    }
  }

  onSubmit(form: NgForm) {
    console.log(form.form.value);
    this.dialogRef.close(form.form.value);
  }

  onCloseModal() {
    this.dialogRef.close();
  }
}
