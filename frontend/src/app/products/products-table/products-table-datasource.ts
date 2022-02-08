import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { mergeMap } from 'rxjs/operators';
import { Observable, merge, of, BehaviorSubject } from 'rxjs';
import { Product } from '../product.model';
import { ProductsService } from '../products.service';

/**
 * Data source for the OrdersTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ProductTableDataSource extends DataSource<Product> {
  paginator: MatPaginator;
  sort: MatSort;
  _filter: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private productService: ProductsService) {
    super();
  }

  set filter(value: string) {
    this._filter.next(value);
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Product[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations: any = [
      of('Initial load'),
      this.paginator.page,
      this.sort.sortChange,
      this.productService.productChangedEvent,
      this._filter.asObservable(),
    ];

    return merge(...dataMutations).pipe(
      mergeMap(() => {
        return this.productService.getProducts(
          this.paginator.pageIndex * this.paginator.pageSize,
          this.paginator.pageSize,
          this.sort.active,
          this.sort.direction,
          this._filter.value
        );
      })
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}
}
