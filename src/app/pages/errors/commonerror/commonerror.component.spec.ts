import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonerrorComponent } from './commonerror.component';

describe('CommonerrorComponent', () => {
  let component: CommonerrorComponent;
  let fixture: ComponentFixture<CommonerrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonerrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonerrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
