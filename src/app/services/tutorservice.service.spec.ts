import { TestBed } from '@angular/core/testing';

import { TutorserviceService } from './tutorservice.service';

describe('TutorserviceService', () => {
  let service: TutorserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TutorserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
