import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ProductTableDataSource } from './products-table-datasource';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { MatDialog } from '@angular/material/dialog';
import {
  ProductModalComponent,
  ModalData,
} from '../product-modal/product-modal.component';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.css'],
})
export class ProductsTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Product>;
  dataSource: ProductTableDataSource;
  dataLength: number;
  errorMessage: string;

  displayedColumns = [
    'product_id',
    'name',
    'price',
    'quantity',
    'description',
    'actions',
  ];

  constructor(
    private productService: ProductsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dataSource = new ProductTableDataSource(this.productService);
    this.productService.getProductCount().subscribe({
      next: (orderCount) => {
        this.dataLength = orderCount;
      },
      error: (err) => (this.errorMessage = err),
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  onEditProduct(product_id: number) {
    let modalData: ModalData = new ModalData();
    this.productService.getProduct(product_id).subscribe((resData) => {
      modalData.product = resData.data;
      modalData.isUpdate = true;
      const dialogRef = this.dialog.open(ProductModalComponent, {
        data: modalData,
        panelClass: 'modal-container',
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.productService.updateProduct(product_id, result);
      });
    });
  }

  onDeleteProduct(product_id: number) {
    this.productService.deleteProduct(product_id);
  }

  onApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
