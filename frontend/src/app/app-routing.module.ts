import { DashComponent } from './dash/dash.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesComponent } from './sales/sales.component';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { AuthSignUpComponent } from './auth-signup/auth-signup.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', canActivate: [AuthGuard], component: DashComponent },
  { path: 'sales', canActivate: [AuthGuard], component: SalesComponent },
  { path: 'login', component: AuthLoginComponent },
  { path: 'signup', component: AuthSignUpComponent },
  {
    path: 'demos',
    loadChildren: () =>
      import('./sales/sales.module').then((m) => m.SalesModule),
  },
  {
    path: 'products',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./products/products.module').then((m) => m.ProductsModule),
  },
  {
    path: 'customers',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./customers/customers.module').then((m) => m.CustomersModule),
  },
  {
    path: 'admin/users',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
