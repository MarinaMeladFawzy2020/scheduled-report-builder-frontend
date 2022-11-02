import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsreportschedulerComponent } from './actionsreportscheduler.component';

describe('ActionsreportschedulerComponent', () => {
  let component: ActionsreportschedulerComponent;
  let fixture: ComponentFixture<ActionsreportschedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionsreportschedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsreportschedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
