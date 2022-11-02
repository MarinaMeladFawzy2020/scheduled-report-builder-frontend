import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditreportschedulerComponent } from './editreportscheduler.component';

describe('EditreportschedulerComponent', () => {
  let component: EditreportschedulerComponent;
  let fixture: ComponentFixture<EditreportschedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditreportschedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditreportschedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
