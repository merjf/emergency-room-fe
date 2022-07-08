import { TestBed } from '@angular/core/testing';

import { VerbaleService } from './verbale.service';

describe('VerbaleService', () => {
  let service: VerbaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerbaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
