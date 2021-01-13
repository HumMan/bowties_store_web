import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordChangeComponent } from './reset-password-change.component';

describe('ResetPasswordChangeComponent', () => {
  let component: ResetPasswordChangeComponent;
  let fixture: ComponentFixture<ResetPasswordChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
