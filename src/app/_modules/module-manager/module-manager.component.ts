import { AfterViewInit, Component, ElementRef, EventEmitter, Output, Type, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { CommonModuleComponent } from '../common-module/common-module.component';
import { HeaderModuleComponent } from '../header-module/header-module.component';
import { ModuleDirective } from '../_directives/module.directive';

declare var tinymce: any;

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
export class ModuleManagerComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('editable') editable!: ElementRef;
  @ViewChild(CdkConnectedOverlay) overlay!: CdkConnectedOverlay;

  @ViewChild(ModuleDirective, { static: true }) moduleHost!: ModuleDirective;

  @Output() selectedModule = new EventEmitter<Type<CommonModuleComponent>>();

  modules: ModuleItem[] = [{ name: 'Header', icon: 'home', tags: ['text', 'title'], component: HeaderModuleComponent }];

  moduleForm!: FormControl;
  filteredModules: ModuleItem[] = [];
  editableFocused: boolean = true;
  selectedElem: number = 0;
  moduleSelected: boolean = false;

  constructor(public fb: FormBuilder) {
    this.moduleForm = fb.control('');
  }

  ngAfterViewInit(): void {
    let textConfig = {
      target: this.editable.nativeElement,
      base_url: '/tinymce',
      suffix: '.min',
      menubar: false,
      branding: false,
      statusbar: false,
      inline: true,
      toolbar: false,
      plugins: ['quickbars'],
      quickbars_insert_toolbar: '',
      quickbars_selection_toolbar: 'italic underline | forecolor backcolor',
      setup: (editor: any) => {
        editor.on('input', (e: any) => {
          let text: string = e.srcElement.innerText;
          this.onChange(text);
          if (text && text.startsWith('/')) {
            this.filteredModules = this.search(text);
          } else {
            this.filteredModules = [];
          }
        });
        editor.on('focus', () => {
          this.editableFocused = true;
          this.selectedElem = 0;
        });
        editor.on('blur', () => {
          this.editableFocused = false;
        });
      }
    };
    tinymce.init(textConfig);
  }

  get value() {
    return this.moduleForm.value;
  }

  private search(value: string): ModuleItem[] {
    const filterValue = value.toLowerCase().substr(1);
    var filtered = new Set(this.modules.filter((option) => option.name.toLowerCase().includes(filterValue)));
    let subfiltered = this.modules.filter((option) =>
      option.tags.some((val) => val.toLowerCase().includes(filterValue))
    );
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

  writeValue() {}

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched() {}
}
