import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { User } from '../user.model';
import { RolesService } from '../roles.service';
import { RoleTableDataSource } from './roles-table-datasource';

@Component({
  selector: 'app-roles-table',
  templateUrl: './roles-table.component.html',
  styleUrls: ['./roles-table.component.css'],
})
export class RolesTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<User>;
  dataSource: RoleTableDataSource;
  dataLength: number;
  errorMessage: string;

  displayedColumns = [
    'user_id',
    'firstname',
    'lastname',
    'email',
    'role',
    'actions',
  ];

  constructor(private roleService: RolesService) {}

  ngOnInit(): void {
    this.dataSource = new RoleTableDataSource(this.roleService);
    this.roleService.getUserCount().subscribe({
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

  onToggleRole(user_id: number) {
    this.roleService.toggleRole(user_id);
  }

  onApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
