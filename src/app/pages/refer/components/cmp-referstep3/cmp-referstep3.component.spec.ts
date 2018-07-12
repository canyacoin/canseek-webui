import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpReferstep3Component } from './cmp-referstep3.component';

describe('CmpReferstep3Component', () => {
  let component: CmpReferstep3Component;
  let fixture: ComponentFixture<CmpReferstep3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpReferstep3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpReferstep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
