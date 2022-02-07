import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { OrdersTableDataSource } from './orders-table-datasource';
import { OrderService } from '../orders.service';
import { Order } from '../order';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.css'],
})
export class OrdersTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Order>;
  @Input('actions') showActions: boolean = false;
  dataSource: OrdersTableDataSource;
  dataLength: number;
  errorMessage: string;

  log(val) {
    console.log(val);
  }

  displayedColumns = [
    'order_id',
    'date',
    'name',
    'status',
    'orderTotal',
    'paymentMethod',
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    if (!this.showActions) {
      this.displayedColumns.pop();
    } else {
      this.displayedColumns.push('actions');
    }
    this.dataSource = new OrdersTableDataSource(this.orderService);
    this.orderService.getOrderCount().subscribe({
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

  onNextStatus(order_id: number) {
    this.orderService.nextStatus(order_id);
  }
}
