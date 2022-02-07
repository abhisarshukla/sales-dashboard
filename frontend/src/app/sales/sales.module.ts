import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { OrdersModule } from '../orders/orders.module';

@NgModule({
  declarations: [SalesComponent],
  imports: [CommonModule, SalesRoutingModule, OrdersModule],
})
export class SalesModule {}
