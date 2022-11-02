import { TestBed } from '@angular/core/testing';

import { LookupapiService } from './lookupapi.service';

describe('LookupapiService', () => {
  let service: LookupapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LookupapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
