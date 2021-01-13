import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCheckoutComponent } from './checkout.component';

describe('CheckoutComponent', () => {
  let component: StoreCheckoutComponent;
  let fixture: ComponentFixture<StoreCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
