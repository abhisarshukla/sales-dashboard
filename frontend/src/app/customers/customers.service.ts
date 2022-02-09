import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Customer } from './customer.model';

interface CustomersResponse {
  data: Customer[];
}

@Injectable()
export class CustomersService {
  constructor(private http: HttpClient) {}
  customerChangedEvent: EventEmitter<string> = new EventEmitter();
  getCustomers(
    offset?: number,
    pageSize?: number,
    sortField?: string,
    sortDirection?: string,
    filterString?: string
  ): Observable<Customer[]> {
    return this.http
      .get<CustomersResponse>('http://127.0.0.1:4000/api/customer/all')
      .pipe(
        map((response) => {
          return this.getPagedData(
            this.getSortedData(response.data, sortField, sortDirection),
            offset,
            pageSize
          ).filter((customer) => {
            if (filterString.length === 0) return true;
            else {
              return (customer.name.firstname + customer.name.lastname)
                .toLowerCase()
                .includes(filterString);
            }
          });
        }),
        catchError(this.handleError)
      );
  }

  getCustomerCount(): Observable<number> {
    return this.http
      .get<CustomersResponse>('http://127.0.0.1:4000/api/customer/all')
      .pipe(
        map((response) => {
          return response.data.length;
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

  private getPagedData(data: Customer[], startIndex: number, pageSize: number) {
    return data.splice(startIndex, pageSize);
  }

  private getSortedData(data: Customer[], active: string, direction: string) {
    if (!active || direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = direction === 'asc';
      switch (active) {
        case 'customer_id':
          return compare(+a.customer_id, +b.customer_id, isAsc);
        case 'firstname':
          return compare(+a.name.firstname, +b.name.firstname, isAsc);
        case 'lastname':
          return compare(+a.name.lastname, +b.name.lastname, isAsc);
        default:
          return 0;
      }
    });
  }

  getCustomer(customer_id: number): Observable<{ data: Customer }> {
    return this.http.get<{ data: Customer }>(
      `http://127.0.0.1:4000/api/customer/${customer_id}`
    );
  }

  updateCustomer(customer_id: number, data: Customer) {
    this.http
      .put<Customer>(`http://127.0.0.1:4000/api/customer/${customer_id}`, data)
      .subscribe((_res) => this.customerChangedEvent.emit('changed'));
  }

  createCustomer(data: Customer) {
    this.http
      .post<Customer>(`http://127.0.0.1:4000/api/customer`, data)
      .subscribe((_res) => this.customerChangedEvent.emit('added'));
  }

  deleteCustomer(customer_id: number) {
    this.http
      .delete(`http://127.0.0.1:4000/api/customer/${customer_id}`)
      .subscribe((_res) => this.customerChangedEvent.emit('removed'));
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
