import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../../client/api/order.service';
import { CartService } from '../../client/api/cart.service';
import { Cart, CheckoutParameters, CreateOrderRequest } from '../../client';
import { CurrentCartShare } from '../../services/data.service';
import { AuthenticationService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class StoreCheckoutComponent implements OnInit, OnDestroy {

  deliveryForm: FormGroup;
  contactForm: FormGroup;
  adressForm: FormGroup;
  paymentForm: FormGroup;

  @ViewChild('yandexPaymentForm')
  yandexPaymentForm: ElementRef;

  submitted = false;
  loading: boolean;
  returnUrl: string;
  error = '';

  postalCodeChanged$ = new Subject<string>();

  currentCart: Cart;

  private subscriptions = new Subscription();

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private auth: AuthenticationService,
    private cartShared: CurrentCartShare,
    private orders: OrderService) { }

  toString(value?: string) {
    if (value) {
      return value;
    } else {
      return '';
    }
  }

  ngOnInit() {
    this.createForm();

    this.cartService.Current().subscribe((cart) => {
      this.currentCart = cart;
    });

    this.orders.checkoutParams().subscribe(params => {
      let emailToSet = '';
      if (params) {
        emailToSet = params.email;
        this.contactForm.setValue({
          email: this.toString(params.email),
          // accountVK: this.toString(params.vkAccount),
          name: this.toString(params.name),
          phone: this.toString(params.phone)
        });
        this.deliveryForm.setValue({
          type: params.deliveryType + '',
          otherInfo: this.toString(params.otherInfo)
        });

        this.adressForm.setValue({
          postalCode: this.toString(params.deliveryAddress.postalCode),
          adressRegion: this.toString(params.deliveryAddress.region),
          adressCity: this.toString(params.deliveryAddress.city),
          adress: this.toString(params.deliveryAddress.address)
        });
      }
      if (!emailToSet) {
        const user = this.auth.currentUser();
        if (user && !user.isTempSession) {
          this.contactForm.get('email').setValue(user.name);
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  needPaymentNow(): boolean {
    return this.paymentForm.get('type').value === 0 ||
      this.paymentForm.get('type').value === 1;
  }

  createForm() {

    this.deliveryForm = this.formBuilder.group({
      type: ['0', [Validators.required]],
      otherInfo: ['', []]
    });

    this.subscriptions.add(
      this.deliveryForm.controls.type.valueChanges.subscribe((value) => {
        if (['2'].indexOf(this.paymentForm.controls.type.value) !== -1) {
          this.paymentForm.controls.type.setValue('');
        }
      })
    );

    this.contactForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      //accountVK: ['', []],
      name: ['', []],
      phone: ['', [Validators.required]],
    });

    this.adressForm = this.formBuilder.group({
      postalCode: ['', [Validators.required]],
      adressRegion: ['', [Validators.required]],
      adressCity: ['', [Validators.required]],
      adress: ['', [Validators.required]],
    });

    this.subscriptions.add(
      this.postalCodeChanged$
        .pipe(
          filter(i => i.length === 6),
          debounceTime(1000),
          distinctUntilChanged(),
          switchMap(term => this.http.get<any>('/api/order/postalinfo?i=' + term))
        )
        .subscribe((response) => {
          this.adressForm.controls.adressCity.setValue(response.city);
          this.adressForm.controls.adressRegion.setValue(response.region);
        })
    );

    this.subscriptions.add(
      this.adressForm.controls.postalCode.valueChanges.subscribe((value) => {
        this.postalCodeChanged$.next(value);
      })
    );

    this.paymentForm = this.formBuilder.group({
      type: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.contactForm.invalid ||
      this.deliveryForm.invalid ||
      this.paymentForm.invalid ||
      (this.adressForm.invalid && this.deliveryForm.controls.type.value === 0)) {
      return;
    }

    this.loading = true;

    const params = new CheckoutParameters();
    params.deliveryAddress.address = this.adressForm.get('adress').value;
    params.deliveryAddress.city = this.adressForm.get('adressCity').value;
    params.deliveryAddress.region = this.adressForm.get('adressRegion').value;
    params.deliveryAddress.postalCode = this.adressForm.get('postalCode').value;

    params.deliveryType = parseInt(this.deliveryForm.get('type').value, 10);
    params.otherInfo = this.deliveryForm.get('otherInfo').value;

    params.email = this.contactForm.get('email').value;
    params.name = this.contactForm.get('name').value;
    params.phone = this.contactForm.get('phone').value;
    //params.vkAccount = this.contactForm.get('accountVK').value;

    params.paymentType = parseInt(this.paymentForm.get('type').value, 10);

    const request = new CreateOrderRequest();
    request.parameters = params;
    request.cart = this.currentCart;

    this.loading = true;

    this.subscriptions.add(
      this.orders.CreateOrder(request).subscribe(result => {
        this.loading = false;
        if (result.success) {
          this.cartShared.setData(new Cart());
          this.router.navigate(['/success', result.order.id]);
        } else {
          if (result.notEnoughtInventory) {
            this.router.navigate(['/cart']);
          } else {
            this.error = result.message;
          }
        }
      })
    );
  }
}
