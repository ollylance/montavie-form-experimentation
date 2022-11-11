import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';

import { CommonModuleComponent } from '../common-module/common-module.component';
import { FormBuilder } from '@angular/forms';
import { ModuleFormItem } from '../modules';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-text-module',
  templateUrl: './text-module.component.html',
  styleUrls: ['./text-module.component.scss']
})
export class TextModuleComponent extends CommonModuleComponent implements OnInit, AfterViewInit {
  @ViewChild('editable') editable!: ElementRef;
  moduleText: string = '';

  @ViewChild('highlightSettings') highlightSettings!: TemplateRef<any>;
  @ViewChild('moduleSettings') moduleSettings!: TemplateRef<any>;
  highlightPortal!: TemplatePortal<any>;
  modulePortal!: TemplatePortal<any>;

  private host!: DomPortalOutlet;

  constructor(
    public override _fb: FormBuilder,
    private _renderer: Renderer2,
    private _viewContainerRef: ViewContainerRef
  ) {
    super(_fb);
  }

  ngOnInit(): void {
    this.moduleForm.valueChanges.subscribe((val) => {
      this.onChange(val);
    });
  }

  ngAfterViewInit(): void {
    this.editable.nativeElement.focus();
    this._renderer.listen(this.editable.nativeElement, 'input', () => {
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

  settingsMouseDown(e: any) {
    e.preventDefault();
  }
}
