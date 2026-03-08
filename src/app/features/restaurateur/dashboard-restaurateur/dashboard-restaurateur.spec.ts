import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRestaurateur } from './dashboard-restaurateur';

describe('DashboardRestaurateur', () => {
  let component: DashboardRestaurateur;
  let fixture: ComponentFixture<DashboardRestaurateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRestaurateur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRestaurateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
