import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { Product } from './product.model';

interface ProductsResponse {
  data: Product[];
}

@Injectable()
export class ProductsService {
  constructor(private http: HttpClient) {}
  productChangedEvent: EventEmitter<string> = new EventEmitter();
  getProducts(
    offset?: number,
    pageSize?: number,
    sortField?: string,
    sortDirection?: string,
    filterString?: string
  ): Observable<Product[]> {
    return this.http
      .get<ProductsResponse>('http://127.0.0.1:4000/api/product/all')
      .pipe(
        map((response) => {
          return this.getPagedData(
            this.getSortedData(response.data, sortField, sortDirection),
            offset,
            pageSize
          ).filter((product) => {
            if (filterString.length === 0) return true;
            else {
              return product.name.toLowerCase().includes(filterString);
            }
          });
        }),
        catchError(this.handleError)
      );
  }

  getProductCount(): Observable<number> {
    return this.http
      .get<ProductsResponse>('http://127.0.0.1:4000/api/product/all')
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

  private getPagedData(data: Product[], startIndex: number, pageSize: number) {
    return data.splice(startIndex, pageSize);
  }

  private getSortedData(data: Product[], active: string, direction: string) {
    if (!active || direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = direction === 'asc';
      switch (active) {
        case 'product_id':
          return compare(+a.product_id, +b.product_id, isAsc);
        case 'quantity':
          return compare(+a.quantity, +b.quantity, isAsc);
        case 'name':
          return compare(+a.name, +b.name, isAsc);
        case 'price':
          return compare(+a.price, +b.price, isAsc);
        default:
          return 0;
      }
    });
  }

  getProduct(product_id: number): Observable<{ data: Product }> {
    return this.http.get<{ data: Product }>(
      `http://127.0.0.1:4000/api/product/${product_id}`
    );
  }

  updateProduct(product_id: number, data: Product) {
    this.http
      .put<Product>(`http://127.0.0.1:4000/api/product/${product_id}`, data)
      .subscribe((_res) => this.productChangedEvent.emit('changed'));
  }

  createProduct(data: Product) {
    this.http
      .post<Product>(`http://127.0.0.1:4000/api/product`, data)
      .subscribe((_res) => this.productChangedEvent.emit('added'));
  }

  deleteProduct(product_id: number) {
    this.http
      .delete(`http://127.0.0.1:4000/api/product/${product_id}`)
      .subscribe((_res) => this.productChangedEvent.emit('removed'));
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
