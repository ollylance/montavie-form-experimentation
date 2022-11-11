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
import { CdkPortal, CdkPortalOutlet, ComponentPortal, DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';

import { BehaviorSubject } from 'rxjs';
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
  focusObservable!: BehaviorSubject<boolean>;

  @ViewChild('moduleSettings') moduleSettings!: TemplateRef<any>;
  portal!: TemplatePortal<any>;
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

    this.portal = new TemplatePortal(this.moduleSettings, this._viewContainerRef);
    let settings = document.querySelector('#module-settings');
    if (settings) {
      this.host = new DomPortalOutlet(settings);
      this.host.attach(this.portal);
    }
  }

  override writeValue(value: ModuleFormItem) {
    if (this.editable) {
      this.editable.nativeElement.textContent = value.text;
    }
    this.moduleText = value.text;
    // if markups is empty, add default
    this.moduleForm.patchValue(value);
  }

  settingsMouseDown(e: any) {
    e.preventDefault();
  }

  toggleBold() {
    let currentModuleMarkups = this.moduleForm.get('markups')?.value;
    currentModuleMarkups.all.bold = !currentModuleMarkups.all.bold;

    this.moduleForm.get('markups')?.setValue(currentModuleMarkups);
  }

  onFocus(event: any) {
    if (this.host) {
      this.host.attach(this.portal);
    }
  }

  onBlur(event: any) {
    this.host.detach();
  }
}
