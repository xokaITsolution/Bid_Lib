import { TestBed } from '@angular/core/testing';

import { ReadyLeaseService } from './ready-lease.service';

describe('ReadyLeaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReadyLeaseService = TestBed.get(ReadyLeaseService);
    expect(service).toBeTruthy();
  });
});
