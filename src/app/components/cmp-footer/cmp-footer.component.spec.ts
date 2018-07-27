import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpFooterComponent } from './cmp-footer.component';

describe('CmpFooterComponent', () => {
  let component: CmpFooterComponent;
  let fixture: ComponentFixture<CmpFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
