import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UsersService } from './users.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { UsersTableComponent } from './users-table/users-table.component';
import { UserModalComponent } from './user-modal/user-modal.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [UsersComponent, UsersTableComponent, UserModalComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
  ],
  providers: [UsersService],
})
export class UsersModule {}
