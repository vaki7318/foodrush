import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRestaurants } from './gestion-restaurants';

describe('GestionRestaurants', () => {
  let component: GestionRestaurants;
  let fixture: ComponentFixture<GestionRestaurants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionRestaurants]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionRestaurants);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
