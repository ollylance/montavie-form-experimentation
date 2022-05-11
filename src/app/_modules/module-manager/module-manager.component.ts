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

import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { CommonModuleComponent } from '../common-module/common-module.component';
import { HeaderModuleComponent } from '../header-module/header-module.component';
import { ModuleDirective } from '../_directives/module.directive';

interface ModuleItem {
  name: string;
  icon: string;
  tags: string[];
  component: Type<CommonModuleComponent>;
}

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
  @ViewChild(CdkConnectedOverlay) overlay!: CdkConnectedOverlay;

  @ViewChild(ModuleDirective, { static: true }) moduleHost!: ModuleDirective;

  @Output() selectedModule = new EventEmitter<Type<CommonModuleComponent>>();

  moduleForm!: FormGroup;
  filteredModules: ModuleItem[] = [];
  overlayOpen: boolean = true;
  selectedElem: number = 0;
  moduleSelected: boolean = false;
  moduleText: string = '';

  constructor(public fb: FormBuilder, public renderer: Renderer2) {
    this.moduleForm = fb.group({
      type: null,
      metadata: fb.array([]),
      text: fb.control('')
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
        this.filteredModules = this.search(text);
        this.overlayOpen = true;
      } else {
        this.filteredModules = [];
      }
    });
    this.renderer.listen(this.editable.nativeElement, 'blur', () => {
      this.overlayOpen = false;
    });
  }

  manageList() {
    if (this.overlayOpen) {
      this.overlayOpen = false;
    } else {
      this.overlayOpen = true;
      this.filteredModules = modules;
    }
  }

  private search(value: string): ModuleItem[] {
    const filterValue = value.toLowerCase().substr(1);
    var filtered = new Set(modules.filter((option) => option.name.toLowerCase().includes(filterValue)));
    let subfiltered = modules.filter((option) => option.tags.some((val) => val.toLowerCase().includes(filterValue)));
    subfiltered.forEach((item) => filtered.add(item));
    return Array.from(filtered);
  }

  handleKeyPressed(event: KeyboardEvent) {
    if (event.key == 'ArrowDown') {
      this.selectedElem = (this.selectedElem + 1) % this.filteredModules.length;
    } else if (event.key == 'ArrowUp') {
      this.selectedElem = (this.selectedElem - 1) % this.filteredModules.length;
      if (this.selectedElem == -1) {
        this.selectedElem = this.filteredModules.length - 1;
      }
    } else if (event.key == 'Enter') {
      this.moduleSelected = true;
      this.selectModule(this.filteredModules[this.selectedElem].component);
    }
  }

  selectModule(module: Type<CommonModuleComponent>) {
    this.selectedModule.emit(module);
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
