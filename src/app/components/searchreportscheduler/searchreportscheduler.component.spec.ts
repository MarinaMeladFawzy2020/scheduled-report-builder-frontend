import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchreportschedulerComponent } from './searchreportscheduler.component';

describe('SearchreportschedulerComponent', () => {
  let component: SearchreportschedulerComponent;
  let fixture: ComponentFixture<SearchreportschedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchreportschedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchreportschedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
