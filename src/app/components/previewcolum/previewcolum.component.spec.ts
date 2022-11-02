import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewcolumComponent } from './previewcolum.component';

describe('PreviewcolumComponent', () => {
  let component: PreviewcolumComponent;
  let fixture: ComponentFixture<PreviewcolumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewcolumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewcolumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
