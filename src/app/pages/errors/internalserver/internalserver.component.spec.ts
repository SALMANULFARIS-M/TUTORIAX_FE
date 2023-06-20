import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalserverComponent } from './internalserver.component';

describe('InternalserverComponent', () => {
  let component: InternalserverComponent;
  let fixture: ComponentFixture<InternalserverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalserverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
