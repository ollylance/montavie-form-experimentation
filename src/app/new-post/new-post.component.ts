import { AfterViewInit, Component, ElementRef, QueryList, Type, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ModuleFormItem, modules } from '../_modules/modules';

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CommonModuleComponent } from '../_modules/common-module/common-module.component';
import { HeaderModuleComponent } from '../_modules/header-module/header-module.component';
import { ImageModuleComponent } from '../_modules/image-module/image-module.component';
import { TextModuleComponent } from '../_modules/text-module/text-module.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent {
  @ViewChild('page') page!: ElementRef;
  @ViewChild('navbar') navbar!: ElementRef;
  @ViewChildren('editable') moduleElements!: QueryList<ElementRef>;

  form!: FormGroup;
  focusIndex: number = 0;
  openNav: boolean = true;
  offsetWidth = 0;

  constructor(private fb: FormBuilder, private elem: ElementRef) {
    this.form = fb.group({
      modules: fb.array([this.newControl(TextModuleComponent)])
    });
  }

  get modules() {
    return this.form.get('modules') as FormArray;
  }

  getCursorPos() {
    const selection = window.getSelection();
    const aOff = selection?.anchorOffset || 0;
    const fOff = selection?.focusOffset || 0;
    const text = selection?.anchorNode!.textContent || '';
    return { text: text, start: Math.min(aOff, fOff), end: Math.max(aOff, fOff) };
  }

  handleKeydown(e: KeyboardEvent, index: number) {
    if (e.key == 'ArrowUp') {
      e.preventDefault();
      this.focusOnIndex(index - 1);
    } else if (e.key == 'ArrowDown') {
      e.preventDefault();
      this.focusOnIndex(index + 1);
    } else if (e.key == 'Backspace') {
      const pos = this.getCursorPos();
      if (pos.start == 0) {
        e.preventDefault();
        this.handleDelete(index);
      }
    } else if (e.key == 'Enter') {
      e.preventDefault();
      this.handleEnter(index);
    }
  }

  moveItemInFormArray(formArray: FormArray, fromIndex: number, toIndex: number): void {
    const dir = toIndex > fromIndex ? 1 : -1;

    const item = formArray.at(fromIndex);
    for (let i = fromIndex; i * dir < toIndex * dir; i = i + dir) {
      const current = formArray.at(i + dir);
      formArray.setControl(i, current);
    }
    formArray.setControl(toIndex, item);
  }

  newControl(type: Type<CommonModuleComponent>, text?: String, metadata?: any, markups?: any, id?: string) {
    let standardMarkups = { bold: [], italics: [], link: [], all: { font: '', alignment: 0 } };
    return this.fb.control({
      type: type,
      text: text ? text : '',
      metadata: metadata ? metadata : {},
      markups: markups ? markups : standardMarkups,
      id: id ? id : uuidv4()
    });
  }

  drop(event: CdkDragDrop<ModuleFormItem[]>) {
    if (event.previousContainer === event.container) {
      this.moveItemInFormArray(this.modules, event.previousIndex, event.currentIndex);
    } else {
      const module = event.previousContainer.data[event.previousIndex];
      this.modules.push(this.newControl(module.type));

      this.moveItemInFormArray(this.modules, this.modules.length - 1, event.currentIndex);
    }
  }

  onSubmit() {
    console.log(this.modules.value);
  }

  trackModule(_: number, module: any) {
    return module.value.id;
  }

  handleNavbar(navOpened: boolean) {
    this.page.nativeElement.classList.add(navOpened ? 'pc-open-padding' : 'pc-closed-padding');
    this.page.nativeElement.classList.remove(navOpened ? 'pc-closed-padding' : 'pc-open-padding');
    this.navbar.nativeElement.classList.add(navOpened ? 'nav-open' : 'nav-closed');
    this.navbar.nativeElement.classList.remove(navOpened ? 'nav-closed' : 'nav-open');
  }

  handleEnter(index: number) {
    const pos = this.getCursorPos();
    const before = pos.text.slice(0, pos.start);
    const next = pos.text.slice(pos.end);
    this.modules.at(index)?.patchValue({ text: before });
    this.modules.insert(index + 1, this.newControl(TextModuleComponent, next));
  }

  isTextModule(value: ModuleFormItem) {
    const moduleVal = modules.find((elem) => elem.component == value.type);
    if (moduleVal?.type == 'text') {
      return true;
    } else {
      return false;
    }
  }

  focusOnIndex(index: number) {
    this.elem.nativeElement.querySelectorAll('.editable')[index]?.focus();
  }

  handleDelete(index: number) {
    const currentValue: ModuleFormItem = this.modules.at(index).value;
    // if current module is a text module
    if (this.isTextModule(currentValue)) {
      const pos = this.getCursorPos();
      const text = pos.text.slice(pos.end);
      if (index == 0) {
        this.modules.removeAt(0);
        if (this.modules.length <= 1) {
          this.modules.insert(0, this.newControl(TextModuleComponent));
        }
        this.focusOnIndex(index);
      } else {
        // if previous module is a text module go through with both
        const beforeFormVal: ModuleFormItem = this.modules.at(index - 1).value;
        if (this.isTextModule(beforeFormVal)) {
          let beforeVal: string = beforeFormVal.text;
          this.modules.at(index - 1)?.patchValue({ text: beforeVal + text });
          this.modules.removeAt(index);
          this.focusOnIndex(index - 1);
          let sel = window.getSelection();
          const node = sel?.anchorNode;
          let range = document.createRange();
          if (node) {
            range.setStart(node, beforeVal.length);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        } else {
          this.focusOnIndex(index - 1);
        }
      }
    } else {
      if (index == 0) {
        this.modules.removeAt(0);
        if (this.modules.length <= 1) {
          this.modules.insert(0, this.newControl(TextModuleComponent));
        }
        this.focusOnIndex(index);
      } else {
        // if previous module is a text module go through with both
        const beforeFormVal: ModuleFormItem = this.modules.at(index - 1).value;
        if (this.isTextModule(beforeFormVal)) {
          let beforeVal: string = beforeFormVal.text;
          this.modules.removeAt(index);
          this.focusOnIndex(index - 1);
          let sel = window.getSelection();
          const node = sel?.anchorNode;
          let range = document.createRange();
          if (node) {
            range.setStart(node, beforeVal.length);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        } else {
          this.focusOnIndex(index - 1);
        }
      }
    }
  }
}
