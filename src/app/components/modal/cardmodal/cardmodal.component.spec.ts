import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardmodalComponent } from './cardmodal.component';

describe('CardmodalComponent', () => {
  let component: CardmodalComponent;
  let fixture: ComponentFixture<CardmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
