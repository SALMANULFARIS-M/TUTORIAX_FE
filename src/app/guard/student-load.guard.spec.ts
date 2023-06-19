import { TestBed } from '@angular/core/testing';

import { StudentLoadGuard } from './student-load.guard';

describe('StudentLoadGuard', () => {
  let guard: StudentLoadGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StudentLoadGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
