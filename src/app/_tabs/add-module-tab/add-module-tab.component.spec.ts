import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModuleTabComponent } from './add-module-tab.component';

describe('AddModuleTabComponent', () => {
  let component: AddModuleTabComponent;
  let fixture: ComponentFixture<AddModuleTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModuleTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModuleTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
