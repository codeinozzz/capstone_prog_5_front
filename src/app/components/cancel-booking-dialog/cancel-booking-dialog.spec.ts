import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelBookingDialog } from './cancel-booking-dialog';

describe('CancelBookingDialog', () => {
  let component: CancelBookingDialog;
  let fixture: ComponentFixture<CancelBookingDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelBookingDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelBookingDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
