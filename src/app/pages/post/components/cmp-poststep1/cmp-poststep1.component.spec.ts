import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpPoststep1Component } from './cmp-poststep1.component';

describe('CmpPoststep1Component', () => {
  let component: CmpPoststep1Component;
  let fixture: ComponentFixture<CmpPoststep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpPoststep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpPoststep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
