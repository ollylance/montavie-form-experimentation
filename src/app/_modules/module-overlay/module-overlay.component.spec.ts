import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleOverlayComponent } from './module-overlay.component';

describe('ModuleOverlayComponent', () => {
  let component: ModuleOverlayComponent;
  let fixture: ComponentFixture<ModuleOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModuleOverlayComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
