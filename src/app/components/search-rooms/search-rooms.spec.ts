import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRooms } from './search-rooms';

describe('SearchRooms', () => {
  let component: SearchRooms;
  let fixture: ComponentFixture<SearchRooms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchRooms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchRooms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
