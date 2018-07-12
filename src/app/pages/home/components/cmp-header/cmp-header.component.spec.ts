import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpHeaderComponent } from './cmp-header.component';

describe('CmpHeaderComponent', () => {
  let component: CmpHeaderComponent;
  let fixture: ComponentFixture<CmpHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
