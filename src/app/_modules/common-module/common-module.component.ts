import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-common-module',
  templateUrl: './common-module.component.html',
  styleUrls: ['./common-module.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommonModuleComponent),
      multi: true
    }
  ]
})
export class CommonModuleComponent implements ControlValueAccessor {
  public moduleForm!: FormGroup;

  constructor(public fb: FormBuilder) {
    this.moduleForm = fb.group({
      value: fb.control('')
    });
  }

  getControl() {}

  writeValue(value: any) {
    return value;
  }

  onChange: any = () => {};

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched() {}
}
