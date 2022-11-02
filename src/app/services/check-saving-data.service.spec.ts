import { TestBed } from '@angular/core/testing';

import { CheckSavingDataService } from './check-saving-data.service';

describe('CheckSavingDataService', () => {
  let service: CheckSavingDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckSavingDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
