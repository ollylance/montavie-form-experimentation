import { Component, OnInit, Type, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CommonModuleComponent } from '../common-module/common-module.component';
import { HeaderModuleComponent } from '../header-module/header-module.component';

@Component({
  selector: 'app-module-container',
  templateUrl: './module-container.component.html',
  styleUrls: ['./module-container.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ModuleContainerComponent),
      multi: true
    }
  ]
})
export class ModuleContainerComponent implements OnInit, ControlValueAccessor {
  public moduleForm!: FormGroup;

  isModuleSelected: boolean = true;
  selectedModule: Type<CommonModuleComponent> = HeaderModuleComponent;

  constructor(public fb: FormBuilder) {
    this.moduleForm = fb.group({
      module: fb.control('')
    });
  }

  ngOnInit(): void {
    this.moduleForm.get('module')?.valueChanges.subscribe((val) => {
      this.onChange(val);
    });
  }

  moduleSelectedEvent(m: Type<CommonModuleComponent>) {
    this.selectedModule = m;
    this.isModuleSelected = true;
  }

  onChange: any = () => {};

  writeValue(value: any) {
    this.moduleForm.get('module')?.setValue(value);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched() {}
}
