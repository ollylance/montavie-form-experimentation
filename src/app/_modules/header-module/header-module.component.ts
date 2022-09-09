import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

import { CommonModuleComponent } from '../common-module/common-module.component';
import { FormBuilder } from '@angular/forms';
import { ModuleFormItem } from '../modules';

@Component({
  selector: 'app-header-module',
  templateUrl: './header-module.component.html',
  styleUrls: ['./header-module.component.scss']
})
export class HeaderModuleComponent extends CommonModuleComponent implements OnInit, AfterViewInit {
  @ViewChild('editable') editable!: ElementRef;
  moduleText: string = '';

  constructor(public override fb: FormBuilder, private renderer: Renderer2) {
    super(fb);
    this.moduleForm = fb.group({
      type: HeaderModuleComponent,
      metadata: [],
      text: fb.control(''),
      id: fb.control(uuidv4())
    });
  }

  ngOnInit(): void {
    this.moduleForm.valueChanges.subscribe((val) => {
      this.onChange(val);
    });
  }

  ngAfterViewInit(): void {
    this.editable.nativeElement.focus();
    this.renderer.listen(this.editable.nativeElement, 'input', () => {
      let text: string = this.editable.nativeElement.innerText;
      this.moduleForm.get('text')?.setValue(text);
    });
  }

  override writeValue(value: ModuleFormItem) {
    if (this.editable) {
      this.editable.nativeElement.textContent = value.text;
    }
    this.moduleText = value.text;
    this.moduleForm.patchValue(value);
  }
}
