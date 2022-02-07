import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Order } from './order';

interface OrdersResponse {
  body: Order[];
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private ordersUrl = 'http://127.0.0.1:4000/api/order/all';

  constructor(private http: HttpClient) {}

  getOrders(
    offset?: number,
    pageSize?: number,
    sortField?: string,
    sortDirection?: string
  ): Observable<Order[]> {
    return this.http.get<OrdersResponse>(this.ordersUrl).pipe(
      map((response) => {
        console.log(response);
        return this.getPagedData(
          this.getSortedData(response.body, sortField, sortDirection),
          offset,
          pageSize
        );
      }),
      catchError(this.handleError)
    );
  }

  getOrderCount(): Observable<number> {
    return this.http.get<OrdersResponse>(this.ordersUrl).pipe(
      map((response) => {
        return response.body.length;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }

  private getPagedData(data: Order[], startIndex: number, pageSize: number) {
    return data.splice(startIndex, pageSize);
  }

  private getSortedData(data: Order[], active: string, direction: string) {
    console.log(data);
    if (!active || direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = direction === 'asc';
      switch (active) {
        case 'order_id':
          return compare(+a.order_id, +b.order_id, isAsc);
        case 'date':
          return compare(+a.date, +b.date, isAsc);
        case 'name':
          return compare(
            +(a.customer_id.name.firstname + a.customer_id.name.lastname),
            +(b.customer_id.name.firstname + b.customer_id.name.lastname),
            isAsc
          );
        case 'status':
          return compare(+a.status, +b.status, isAsc);
        case 'orderTotal':
          return compare(+a.orderTotal, +b.orderTotal, isAsc);
        case 'paymentMethod':
          return compare(+a.paymentMethod, +b.paymentMethod, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
