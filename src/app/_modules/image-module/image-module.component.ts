import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { CommonModuleComponent } from '../common-module/common-module.component';
import { FormBuilder } from '@angular/forms';
import { ModuleFormItem } from '../modules';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-module',
  templateUrl: './image-module.component.html',
  styleUrls: ['./image-module.component.scss']
})
export class ImageModuleComponent extends CommonModuleComponent implements OnInit {
  @ViewChild('fileUploader') fileUploader!: ElementRef;
  previewImgUrl: SafeUrl | undefined = undefined;

  constructor(public override _fb: FormBuilder) {
    super(_fb);
  }

  ngOnInit(): void {
    this.moduleForm.valueChanges.subscribe((val) => {
      this.onChange(val);
    });
  }

  onFileSelect(event: Event) {
    if ((event.target as HTMLInputElement).files) {
      const file = (event.target as HTMLInputElement).files![0];
      this.moduleForm.get('metadata')!.setValue({ image: file });
      this.onChange(this.moduleForm);
      this.moduleForm.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImgUrl = reader.result?.toString();
      };
      reader.readAsDataURL(file);
    }
  }

  imageValid(index: number) {}

  deleteImage() {}

  override writeValue(value: ModuleFormItem) {
    this.moduleForm.patchValue(value);
  }
}
