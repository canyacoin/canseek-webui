import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferDetailComponent } from './refer-detail.component';

describe('ReferDetailComponent', () => {
  let component: ReferDetailComponent;
  let fixture: ComponentFixture<ReferDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
