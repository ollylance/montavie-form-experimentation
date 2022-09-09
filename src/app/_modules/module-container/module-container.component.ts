import { Component, OnInit, Type, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CommonModuleComponent } from '../common-module/common-module.component';
import { ModuleFormItem } from '../modules';

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
  currModule!: Type<CommonModuleComponent>;

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

  onChange: any = () => {};

  writeValue(value: ModuleFormItem) {
    this.moduleForm.get('module')?.patchValue(value);
    this.currModule = value.type;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched() {}
}
