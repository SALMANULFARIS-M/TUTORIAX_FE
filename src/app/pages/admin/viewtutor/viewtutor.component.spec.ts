import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewtutorComponent } from './viewtutor.component';

describe('ViewtutorComponent', () => {
  let component: ViewtutorComponent;
  let fixture: ComponentFixture<ViewtutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewtutorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewtutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
