import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent {
  @ViewChildren('moduleElement') moduleElements!: QueryList<ElementRef>;
  form!: FormGroup;
  focusIndex: number = 0;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      modules: fb.array([fb.control('')])
    });
  }

  get modules() {
    return this.form.get('modules') as FormArray;
  }

  onSelectE(e: Event) {
    console.log(e);
  }

  getCursorPos() {
    console.log(window.getSelection());
    const selection = window.getSelection();
    const aOff = selection?.anchorOffset || 0;
    const fOff = selection?.focusOffset || 0;
    const text = selection?.anchorNode!.textContent || '';
    return { text: text, start: Math.min(aOff, fOff), end: Math.max(aOff, fOff) };
  }

  newLine(e: Event, index: number) {
    e.preventDefault();
    const pos = this.getCursorPos();
    console.log(pos.text, pos.start, pos.end);
    const before = pos.text.slice(0, pos.start);
    const next = pos.text.slice(pos.end);
    console.log(before, next, this.modules.at(index));
    this.modules.at(index).setValue(before);
    this.modules.insert(index + 1, this.fb.control(next));
    this.focusIndex = index + 1;
  }

  onSubmit() {
    console.log(this.modules.value);
  }

  newModule() {
    this.modules.push(this.fb.control(''));
  }
}
