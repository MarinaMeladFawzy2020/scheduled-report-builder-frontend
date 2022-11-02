import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewqueryComponent } from './previewquery.component';

describe('PreviewqueryComponent', () => {
  let component: PreviewqueryComponent;
  let fixture: ComponentFixture<PreviewqueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewqueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewqueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
