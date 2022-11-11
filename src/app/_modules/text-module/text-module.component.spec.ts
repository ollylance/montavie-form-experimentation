import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextModuleComponent } from './text-module.component';

describe('TextModuleComponent', () => {
  let component: TextModuleComponent;
  let fixture: ComponentFixture<TextModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextModuleComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
