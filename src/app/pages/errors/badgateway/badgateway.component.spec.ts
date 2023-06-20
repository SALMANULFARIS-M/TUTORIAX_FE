import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgatewayComponent } from './badgateway.component';

describe('BadgatewayComponent', () => {
  let component: BadgatewayComponent;
  let fixture: ComponentFixture<BadgatewayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgatewayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadgatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
