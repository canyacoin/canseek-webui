import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpVerifyComponent } from './cmp-verify.component';

describe('CmpVerifyComponent', () => {
  let component: CmpVerifyComponent;
  let fixture: ComponentFixture<CmpVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
