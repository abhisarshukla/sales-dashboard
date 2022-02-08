import { Component, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../product.model';

export class ModalData {
  isUpdate: boolean;
  product: Product;
  constructor() {
    this.isUpdate = false;
    this.product = new Product();
  }
}

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.css'],
})
export class ProductModalComponent {
  @ViewChild('productForm') productForm: NgForm;
  private titleCasePipe = new TitleCasePipe();
  constructor(
    public dialogRef: MatDialogRef<ProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {}

  getValidationErrorMessage(controlName: string) {
    if (this.productForm.form.controls[controlName].hasError('required')) {
      return this.titleCasePipe.transform(controlName) + ' is required!';
    } else {
      return '';
    }
  }
  onSubmit(form: NgForm) {
    this.dialogRef.close(form.form.value);
  }
  onCloseModal() {
    this.dialogRef.close();
  }
}
