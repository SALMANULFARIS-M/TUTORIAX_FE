import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorLoginComponent } from './tutor-login.component';

describe('TutorLoginComponent', () => {
  let component: TutorLoginComponent;
  let fixture: ComponentFixture<TutorLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
