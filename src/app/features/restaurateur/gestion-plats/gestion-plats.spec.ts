import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPlats } from './gestion-plats';

describe('GestionPlats', () => {
  let component: GestionPlats;
  let fixture: ComponentFixture<GestionPlats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPlats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPlats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
