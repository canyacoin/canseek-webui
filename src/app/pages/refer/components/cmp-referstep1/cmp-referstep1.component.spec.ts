import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpReferstep1Component } from './cmp-referstep1.component';

describe('CmpReferstep1Component', () => {
  let component: CmpReferstep1Component;
  let fixture: ComponentFixture<CmpReferstep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpReferstep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpReferstep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
