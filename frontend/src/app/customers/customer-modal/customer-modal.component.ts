import { TitleCasePipe } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Customer } from '../customer.model';

export class ModalData {
  isUpdate: boolean;
  customer: Customer;
  constructor() {
    this.isUpdate = false;
    this.customer = new Customer();
  }
}

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.css'],
})
export class CustomerModalComponent {
  @ViewChild('customerForm') customerForm: NgForm;
  private titleCasePipe = new TitleCasePipe();
  constructor(
    public dialogRef: MatDialogRef<CustomerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {}

  getValidationErrorMessage(controlName: string) {
    if (this.customerForm.form.controls[controlName].hasError('required')) {
      return this.titleCasePipe.transform(controlName) + ' is required!';
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
