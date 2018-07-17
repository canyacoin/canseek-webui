import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpCandidateComponent } from './cmp-candidate.component';

describe('CmpCandidateComponent', () => {
  let component: CmpCandidateComponent;
  let fixture: ComponentFixture<CmpCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
