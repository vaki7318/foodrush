import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeRestaurants } from './liste-restaurants';

describe('ListeRestaurants', () => {
  let component: ListeRestaurants;
  let fixture: ComponentFixture<ListeRestaurants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeRestaurants]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeRestaurants);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
