import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductsService } from './products.service';
import {
  ProductModalComponent,
  ModalData,
} from './product-modal/product-modal.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  constructor(
    private productService: ProductsService,
    private dialog: MatDialog
  ) {}

  onCreateProduct() {
    let modalData: ModalData = new ModalData();
    const dialogRef = this.dialog.open(ProductModalComponent, {
      data: modalData,
      panelClass: 'modal-container',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.productService.createProduct(result);
    });
  }
}
