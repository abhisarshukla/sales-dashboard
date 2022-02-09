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
  constructor(
    public dialogRef: MatDialogRef<CustomerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {}

  onSubmit(form: NgForm) {
    console.log(form.form.value);
    this.dialogRef.close(form.form.value);
  }
  onCloseModal() {
    this.dialogRef.close();
  }
}
