import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersTableComponent } from './orders-table/orders-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [OrdersTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
  ],
  exports: [OrdersTableComponent],
})
export class OrdersModule {}