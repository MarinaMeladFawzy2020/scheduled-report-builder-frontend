import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListreportschedulerComponent } from './listreportscheduler.component';

describe('ListreportschedulerComponent', () => {
  let component: ListreportschedulerComponent;
  let fixture: ComponentFixture<ListreportschedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListreportschedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListreportschedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
