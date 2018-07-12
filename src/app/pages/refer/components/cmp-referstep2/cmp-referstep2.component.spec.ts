import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpReferstep2Component } from './cmp-referstep2.component';

describe('CmpReferstep2Component', () => {
  let component: CmpReferstep2Component;
  let fixture: ComponentFixture<CmpReferstep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpReferstep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpReferstep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
