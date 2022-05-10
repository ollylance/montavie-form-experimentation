import {
  ComponentRef,
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Type,
  ViewContainerRef
} from '@angular/core';
import { ControlContainer, FormControl, NgControl, ValidatorFn } from '@angular/forms';

import { CommonModuleComponent } from '../common-module/common-module.component';

@Directive({
  selector: '[appModule]'
})
export class ModuleDirective extends NgControl implements OnInit, OnDestroy {
  @Input() override name: string = '';
  @Input() module!: Type<CommonModuleComponent>;

  component!: ComponentRef<CommonModuleComponent>;

  @Output() update = new EventEmitter();

  parentPath: string[];
  _control!: FormControl;

  // eslint-disable-next-line no-unused-vars
  constructor(private parent: ControlContainer, private container: ViewContainerRef) {
    super();
    this.parentPath = parent.path!;
  }

  ngOnInit() {
    this.component = this.container.createComponent<CommonModuleComponent>(this.module);
    this.valueAccessor = this.component.instance;
    this._control = this.formDirective.addControl(this);
  }

  override get path(): string[] {
    return [...this.parentPath, this.name];
  }

  get formDirective(): any {
    return this.parent ? this.parent.formDirective : null;
  }

  get control(): FormControl {
    return this._control;
  }

  override get validator(): ValidatorFn | null {
    return null;
  }

  viewToModelUpdate(newValue: any): void {
    this.update.emit(newValue);
  }

  ngOnDestroy(): void {
    if (this.formDirective) {
      this.formDirective.removeControl(this);
    }
    if (this.component) {
      this.component.destroy();
    }
  }
}
