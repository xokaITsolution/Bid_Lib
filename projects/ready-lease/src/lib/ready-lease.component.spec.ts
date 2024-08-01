import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyLeaseComponent } from './ready-lease.component';

describe('ReadyLeaseComponent', () => {
  let component: ReadyLeaseComponent;
  let fixture: ComponentFixture<ReadyLeaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadyLeaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadyLeaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
