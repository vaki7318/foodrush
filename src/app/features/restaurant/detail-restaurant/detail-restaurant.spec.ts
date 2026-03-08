import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRestaurant } from './detail-restaurant';

describe('DetailRestaurant', () => {
  let component: DetailRestaurant;
  let fixture: ComponentFixture<DetailRestaurant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailRestaurant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailRestaurant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
