import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminMainComponent } from './admin-main/admin-main.component';
import { AdminCartsComponent } from './carts/carts.component';
import { AdminGroupsComponent } from './groups/groups.component';
import { AdminOrdersComponent } from './orders/orders.component';
import { AdminProductsComponent } from './products/products.component';
import { AdminUsersComponent } from './users/users.component';
import { AdminSettingsComponent } from './settings/settings.component';
import { RoleGuard } from '../guards/role_guard';
import { User } from '../client';

const routes: Routes = [
  {
    path: '', component: AdminMainComponent,
    children: [
      { path: 'groups', component: AdminGroupsComponent },
      { path: 'products', component: AdminProductsComponent },
      {
        path: 'users', component: AdminUsersComponent,
        canActivate: [RoleGuard],
        data: { role: User.RoleEnum.Admin },
      },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'carts', component: AdminCartsComponent },
      { path: 'settings', component: AdminSettingsComponent },
      { path: '**', component: AdminProductsComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
