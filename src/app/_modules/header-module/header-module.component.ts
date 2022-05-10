import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { CommonModuleComponent } from '../common-module/common-module.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-header-module',
  templateUrl: './header-module.component.html',
  styleUrls: ['./header-module.component.scss']
})
export class HeaderModuleComponent extends CommonModuleComponent implements OnInit, AfterViewInit {
  @ViewChild('editable') editable!: ElementRef;
  headerValue: string = '';

  constructor(public override fb: FormBuilder) {
    super(fb);
    this.moduleForm = fb.group({
      headerModule: fb.control('')
    });
  }

  ngOnInit(): void {
    this.moduleForm.valueChanges.subscribe((val) => {
      this.onChange(val);
    });
  }

  ngAfterViewInit(): void {
    this.editable.nativeElement.focus();
    this.editable.nativeElement.addEventListener('input', () => {
      let text: string = this.editable.nativeElement.innerText;
      this.moduleForm.get('headerModule')?.setValue(text);
    });
  }

  override writeValue(value: any) {
    if (this.editable) {
      this.editable.nativeElement.textContent = value;
    }
    this.headerValue = value;
    this.moduleForm.get('headerModule')?.setValue(this.headerValue);
  }
}
