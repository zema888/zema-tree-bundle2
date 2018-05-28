import { TestBed, inject } from '@angular/core/testing';

import { ElService } from './el.service';

describe('ElService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElService]
    });
  });

  it('should be created', inject([ElService], (service: ElService) => {
    expect(service).toBeTruthy();
  }));
});
