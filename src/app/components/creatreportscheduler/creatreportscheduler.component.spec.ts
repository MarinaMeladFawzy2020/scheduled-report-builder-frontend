import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatreportschedulerComponent } from './creatreportscheduler.component';

describe('CreatreportschedulerComponent', () => {
  let component: CreatreportschedulerComponent;
  let fixture: ComponentFixture<CreatreportschedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatreportschedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatreportschedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
