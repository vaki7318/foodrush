import { TestBed } from '@angular/core/testing';

import { Plat } from './plat';

describe('Plat', () => {
  let service: Plat;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Plat);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
