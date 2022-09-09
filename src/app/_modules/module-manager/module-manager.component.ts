import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
  Type,
  ViewChild,
  forwardRef
} from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ModuleFormItem, modules } from '../modules';

import { v4 as uuidv4 } from 'uuid';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { CommonModuleComponent } from '../common-module/common-module.component';
import { HeaderModuleComponent } from '../header-module/header-module.component';
import { ModuleDirective } from '../_directives/module.directive';
import { OverlayService } from '../module-overlay/overlay.service';

@Component({
  selector: 'app-module-manager',
  templateUrl: './module-manager.component.html',
  styleUrls: ['./module-manager.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ModuleManagerComponent),
      multi: true
    }
  ]
})
export class ModuleManagerComponent implements ControlValueAccessor, AfterViewInit, OnInit {
  @ViewChild('editable') editable!: ElementRef;

  @ViewChild(ModuleDirective, { static: true }) moduleHost!: ModuleDirective;

  @Output() selectedModule = new EventEmitter<Type<CommonModuleComponent>>();

  moduleForm!: FormGroup;
  overlayOpen: boolean = true;
  selectedElem: number = 0;
  moduleSelected: boolean = false;
  moduleText: string = '';
  searchText: string = '';

  constructor(public fb: FormBuilder, public renderer: Renderer2, private overlay: OverlayService) {
    this.moduleForm = fb.group({
      type: null,
      metadata: fb.array([]),
      text: fb.control(''),
      id: fb.control(uuidv4())
    });
  }

  ngOnInit() {
    this.moduleForm.valueChanges.subscribe((val) => {
      this.onChange(val);
    });
  }

  ngAfterViewInit(): void {
    this.editable.nativeElement.focus();
    this.renderer.listen(this.editable.nativeElement, 'input', (e: any) => {
      let text: string = e.srcElement.innerText;
      this.moduleForm.get('text')?.setValue(text);
      if (text && text.startsWith('/')) {
        this.searchText = text;
      } else {
        this.searchText = '';
      }
    });
    this.renderer.listen(this.editable.nativeElement, 'blur', () => {
      this.overlayOpen = false;
    });
  }

  selectModule(module: Type<CommonModuleComponent>) {
    this.selectedModule.emit(module);
  }

  show(origin: any) {
    const ref = this.overlay.open({
      origin,
      text: 'Hello',
      width: '200px',
      height: '200px'
    });

    ref.afterClosed$.subscribe((res: any) => {
      console.log(res);
    });
  }

  manageList() {
    if (this.overlayOpen) {
      this.overlayOpen = false;
    } else {
      this.overlayOpen = true;
      this.searchText = '';
    }
  }

  onChange: any = () => {};

  openMenu() {}

  writeValue(value: ModuleFormItem) {
    if (this.editable) {
      this.editable.nativeElement.textContent = value.text;
    }
    this.moduleText = value.text;
    this.moduleForm.patchValue(value);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched() {}
}
