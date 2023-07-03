import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadrequestComponent } from './badrequest.component';

describe('BadrequestComponent', () => {
  let component: BadrequestComponent;
  let fixture: ComponentFixture<BadrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadrequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
