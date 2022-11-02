import { TestBed } from '@angular/core/testing';

import { SchedulejobService } from './schedulejob.service';

describe('SchedulejobService', () => {
  let service: SchedulejobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchedulejobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
