import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiModule } from './client/api.module';
import { JwtInterceptor } from './interceptors/jwt_intercept';
import { ErrorInterceptor } from './interceptors/error_intercept';
import { ReCaptchaDirective } from './directives/recaptcha';
import { RoleGuard } from './guards/role_guard';
import { User } from './client';
import { ClickOutsideDirective } from './directives/click-outside';

// common
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';

// store
import { StoreCartComponent } from './store/cart/cart.component';
import { StoreCheckoutComponent } from './store/checkout/checkout.component';
import { StoreMainComponent } from './store/store-main/store-main.component';
import { StoreProductInfoComponent } from './store/product-info/product-info.component';
import { StoreHeaderComponent } from './store/header/header.component';
import { StoreFooterComponent } from './store/footer/footer.component';
import { StoreAllGroupsComponent } from './store/all-groups/all-groups.component';
import { StoreGroupComponent } from './store/group/group.component';
import { StoreFilterComponent } from './store/filter/filter.component';
import { StoreGroupsBlocksComponent } from './store/groups-blocks/groups-blocks.component';
import { StoreCheckoutSuccessComponent } from './store/checkout-success/checkout-success.component';

// account
import { AccountLoginComponent } from './account/login/login.component';
import { AccountProfileComponent } from './account/profile/profile.component';
import { AccountRegisterComponent } from './account/register/register.component';
import { AccountResetPasswordComponent } from './account/reset-password/reset-password.component';
import { AccountResetPasswordChangeComponent } from './account/reset-password-change/reset-password-change.component';
import { StoreNotFoundPageComponent } from './store/not-found-page/not-found-page.component';
import { StoreCommonOrderInfoComponent } from './store/common/OrderInfo/order-info.component';
import { StoreCommonOrderStatusComponent } from './store/common/OrderStatus/order-status.component';
import { StoreCommonOrderItemsInfoComponent } from './store/common/OrderItemsInfo/order-items-info.component';
import { AccountCommonPasswordChangeComponent } from './account/common/password-change/password-change.component';
import { AccountVerifyEmailComponent } from './account/verify-email/verify-email.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AppComponent,

    // account start
    AccountLoginComponent,
    AccountProfileComponent,
    AccountRegisterComponent,
    AccountResetPasswordComponent,
    AccountResetPasswordChangeComponent,
    AccountCommonPasswordChangeComponent,
    AccountVerifyEmailComponent,
    // account end

    // store start
    StoreCartComponent,
    StoreCheckoutComponent,
    StoreMainComponent,
    StoreProductInfoComponent,
    StoreHeaderComponent,
    StoreFooterComponent,
    StoreAllGroupsComponent,
    StoreGroupComponent,
    StoreFilterComponent,
    StoreGroupsBlocksComponent,
    StoreCheckoutSuccessComponent,
    StoreNotFoundPageComponent,
    StoreCommonOrderInfoComponent,
    StoreCommonOrderStatusComponent,
    StoreCommonOrderItemsInfoComponent,
    // store end

    // common start
    NavbarComponent,
    // common end

    ReCaptchaDirective,
    ClickOutsideDirective
  ],

  imports: [
    BrowserModule,

    ApiModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
      // TODO tip не забываем что все маршруты еще прописаны в nginx/siteconf для правильного возврата 404
      {
        path: 'admin',
        canActivate: [RoleGuard],
        data: { role: User.RoleEnum.Manager },
        loadChildren: 'src/app/admin/admin.module#AdminModule'
      },
      {
        path: '', component: StoreMainComponent,
        children: [
          {
            path: 'checkout', component: StoreCheckoutComponent,
            canActivate: [RoleGuard],
            data: { role: User.RoleEnum.Anon }
          },
          {
            path: 'success/:id', component: StoreCheckoutSuccessComponent,
            canActivate: [RoleGuard],
            data: { role: User.RoleEnum.Anon }
          },
          {
            path: 'account',
            children: [
              { path: 'login', component: AccountLoginComponent },
              { path: 'register', component: AccountRegisterComponent },
              { path: 'reset', component: AccountResetPasswordComponent },
              { path: 'reset-validate/:id', component: AccountResetPasswordChangeComponent },
              { path: 'email-validate/:id', component: AccountVerifyEmailComponent },
              {
                path: 'profile', component: AccountProfileComponent,
                canActivate: [RoleGuard],
                data: { role: User.RoleEnum.Regular }
              }
            ]
          },
          {
            path: 'cart', component: StoreCartComponent
          },
          {
            path: '', component: StoreAllGroupsComponent,
            children: [
              { path: '', component: StoreGroupsBlocksComponent },
              { path: 'group/:id', component: StoreGroupComponent },
              { path: 'product/:id', component: StoreProductInfoComponent }
            ]
          }
        ]
      },
      {
        path: '**', component: StoreMainComponent,
        children: [
          {
            path: '**', component: StoreAllGroupsComponent,
            children: [
              { path: '**', component: StoreNotFoundPageComponent }]
          }
        ]
      }
    ]
      // , {
      //     scrollPositionRestoration: 'enabled',
      //     anchorScrolling: 'enabled'
      //   }
    )
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }

