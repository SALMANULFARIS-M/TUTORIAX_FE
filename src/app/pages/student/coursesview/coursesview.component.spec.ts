import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesviewComponent } from './coursesview.component';

describe('CoursesviewComponent', () => {
  let component: CoursesviewComponent;
  let fixture: ComponentFixture<CoursesviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursesviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
