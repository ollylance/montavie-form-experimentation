import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ModuleFormItem, modules } from '../_modules/modules';
import { v4 as uuidv4 } from 'uuid';
import { ModuleManagerComponent } from '../_modules/module-manager/module-manager.component';
import { OverlayService } from '../_modules/module-overlay/overlay.service';
import { ImageModuleComponent } from '../_modules/image-module/image-module.component';
import { HeaderModuleComponent } from '../_modules/header-module/header-module.component';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent {
  @ViewChildren('editable') moduleElements!: QueryList<ElementRef>;
  form!: FormGroup;
  focusIndex: number = 0;
  openNav: boolean = true;

  constructor(private fb: FormBuilder, private elem: ElementRef) {
    this.form = fb.group({
      modules: fb.array([fb.control({ type: HeaderModuleComponent, metadata: [], text: '', id: uuidv4() })])
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

  drop(event: CdkDragDrop<ModuleFormItem[]>) {
    this.moveItemInFormArray(this.modules, event.previousIndex, event.currentIndex);
  }

  onSubmit() {
    console.log(this.modules.value);
  }

  trackModule(index: number, module: any) {
    return module.value.id;
  }

  newModule() {
    this.modules.push(this.fb.control({ type: ImageModuleComponent, metadata: [], text: '', id: uuidv4() }));
  }

  handleEnter(index: number) {
    const pos = this.getCursorPos();
    const before = pos.text.slice(0, pos.start);
    const next = pos.text.slice(pos.end);
    this.modules.at(index)?.patchValue({ text: before });
    this.modules.insert(index + 1, this.fb.control({ type: null, metadata: [], text: next, id: uuidv4() }));
  }

  isTextModule(value: ModuleFormItem) {
    const moduleVal = modules.find((elem) => elem.component == value.type);
    console.log(moduleVal?.type);
    if (!value.type || moduleVal?.type == 'text') {
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
          this.modules.insert(0, this.fb.control({ type: null, metadata: [], text: '', id: uuidv4() }));
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
          this.modules.insert(0, this.fb.control({ type: null, metadata: [], text: '', id: uuidv4() }));
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
