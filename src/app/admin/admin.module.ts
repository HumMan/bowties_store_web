import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminMainComponent } from './admin-main/admin-main.component';
import { AdminCartsComponent } from './carts/carts.component';
import { AdminGroupsComponent } from './groups/groups.component';
import { AdminGroupEditComponent } from './groups/edit/edit-group.component';
import { AdminOrdersComponent } from './orders/orders.component';
import { AdminProductsComponent } from './products/products.component';
import { AdminProductEditComponent } from './products/edit-product/edit-product.component';
import { AdminSidebarComponent } from './sidebar/sidebar.component';
import { AdminUsersComponent } from './users/users.component';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import { CallbackPipe } from '../directives/callback.pipe';
import { AdminSettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AdminMainComponent,
    AdminCartsComponent,
    AdminGroupsComponent,
    AdminGroupEditComponent,
    AdminOrdersComponent,
    AdminProductsComponent,
    AdminProductEditComponent,
    AdminSidebarComponent,
    AdminUsersComponent,
    AdminSettingsComponent,
    CallbackPipe
  ],
  entryComponents:
    [
      AdminProductEditComponent,
      AdminGroupEditComponent
    ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule.forRoot(),
    DragulaModule.forRoot()
  ]
})
export class AdminModule { }
