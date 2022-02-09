import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from './user.model';

interface UserssResponse {
  data: User[];
}

@Injectable()
export class UsersService {
  constructor(private http: HttpClient) {}
  userChangedEvent: EventEmitter<string> = new EventEmitter();
  getUsers(
    offset?: number,
    pageSize?: number,
    sortField?: string,
    sortDirection?: string,
    filterString?: string
  ): Observable<User[]> {
    return this.http
      .get<UserssResponse>('http://127.0.0.1:4000/api/user/all')
      .pipe(
        map((response) => {
          return this.getPagedData(
            this.getSortedData(response.data, sortField, sortDirection),
            offset,
            pageSize
          ).filter((user) => {
            if (filterString.length === 0) return true;
            else {
              return (user.name.firstname + user.name.lastname)
                .toLowerCase()
                .includes(filterString);
            }
          });
        }),
        catchError(this.handleError)
      );
  }

  getUserCount(): Observable<number> {
    return this.http
      .get<UserssResponse>('http://127.0.0.1:4000/api/user/all')
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

  private getPagedData(data: User[], startIndex: number, pageSize: number) {
    return data.splice(startIndex, pageSize);
  }

  private getSortedData(data: User[], active: string, direction: string) {
    if (!active || direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = direction === 'asc';
      switch (active) {
        case 'user_id':
          return compare(+a.user_id, +b.user_id, isAsc);
        case 'firstname':
          return compare(+a.name.firstname, +b.name.firstname, isAsc);
        case 'lastname':
          return compare(+a.name.lastname, +b.name.lastname, isAsc);
        case 'email':
          return compare(+a.email, +b.email, isAsc);
        default:
          return 0;
      }
    });
  }

  getUser(user_id: number): Observable<{ data: User }> {
    return this.http.get<{ data: User }>(
      `http://127.0.0.1:4000/api/user/${user_id}`
    );
  }

  updateUser(user_id: number, data: User) {
    this.http
      .put<User>(`http://127.0.0.1:4000/api/user/${user_id}`, data)
      .subscribe((_res) => this.userChangedEvent.emit('changed'));
  }

  deleteUser(user_id: number) {
    this.http
      .delete(`http://127.0.0.1:4000/api/user/${user_id}`)
      .subscribe((_res) => this.userChangedEvent.emit('removed'));
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
