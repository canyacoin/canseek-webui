import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpPostComponent } from './cmp-post.component';

describe('CmpPostComponent', () => {
  let component: CmpPostComponent;
  let fixture: ComponentFixture<CmpPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
