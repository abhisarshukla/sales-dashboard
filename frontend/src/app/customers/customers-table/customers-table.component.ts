import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import {
  CustomerModalComponent,
  ModalData,
} from '../customer-modal/customer-modal.component';
import { Customer } from '../customer.model';
import { CustomersService } from '../customers.service';
import { CustomerTableDataSource } from './customers-table-datasource';

@Component({
  selector: 'app-customers-table',
  templateUrl: './customers-table.component.html',
  styleUrls: ['./customers-table.component.css'],
})
export class CustomersTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Customer>;
  dataSource: CustomerTableDataSource;
  dataLength: number;
  errorMessage: string;

  displayedColumns = [
    'customer_id',
    'firstname',
    'lastname',
    'address',
    'actions',
  ];

  constructor(
    private customerService: CustomersService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dataSource = new CustomerTableDataSource(this.customerService);
    this.customerService.getCustomerCount().subscribe({
      next: (orderCount) => {
        this.dataLength = orderCount;
      },
      error: (err) => (this.errorMessage = err),
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  onEditCustomer(customer_id: number) {
    let modalData: ModalData = new ModalData();
    this.customerService.getCustomer(customer_id).subscribe((resData) => {
      modalData.customer = resData.data;
      modalData.isUpdate = true;
      const dialogRef = this.dialog.open(CustomerModalComponent, {
        data: modalData,
        panelClass: 'modal-container',
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.customerService.updateCustomer(customer_id, result);
      });
    });
  }

  onDeleteCustomer(customer_id: number) {
    this.customerService.deleteCustomer(customer_id);
  }

  onApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
