import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomersService } from './customers.service';
import {
  CustomerModalComponent,
  ModalData,
} from './customer-modal/customer-modal.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent {
  constructor(
    private customerService: CustomersService,
    private dialog: MatDialog
  ) {}

  onCreateCustomer() {
    let modalData: ModalData = new ModalData();
    const dialogRef = this.dialog.open(CustomerModalComponent, {
      data: modalData,
      panelClass: 'modal-container',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.customerService.createCustomer(result);
    });
  }
}
