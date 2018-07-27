import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpBancorComponent } from './cmp-bancor.component';

describe('CmpBancorComponent', () => {
  let component: CmpBancorComponent;
  let fixture: ComponentFixture<CmpBancorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpBancorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpBancorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
