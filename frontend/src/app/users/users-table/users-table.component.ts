import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import {
  UserModalComponent,
  ModalData,
} from '../user-modal/user-modal.component';
import { User } from '../user.model';
import { UsersService } from '../users.service';
import { UserTableDataSource } from './users-table-datasource';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css'],
})
export class UsersTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<User>;
  dataSource: UserTableDataSource;
  dataLength: number;
  errorMessage: string;

  displayedColumns = ['user_id', 'firstname', 'lastname', 'email', 'actions'];

  constructor(private userService: UsersService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource = new UserTableDataSource(this.userService);
    this.userService.getUserCount().subscribe({
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

  onEditUser(user_id: number) {
    let modalData: ModalData = new ModalData();
    this.userService.getUser(user_id).subscribe((resData) => {
      modalData.user = resData.data;
      const dialogRef = this.dialog.open(UserModalComponent, {
        data: modalData,
        panelClass: 'modal-container',
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.userService.updateUser(user_id, result);
      });
    });
  }

  onDeleteUser(user_id: number) {
    this.userService.deleteUser(user_id);
  }

  onApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
