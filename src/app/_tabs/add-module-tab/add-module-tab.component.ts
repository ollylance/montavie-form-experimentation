import { Component, Input } from '@angular/core';
import { CdkDragEnter } from '@angular/cdk/drag-drop';
import { HeaderModuleComponent } from 'src/app/_modules/header-module/header-module.component';
import { ImageModuleComponent } from 'src/app/_modules/image-module/image-module.component';
import { TextModuleComponent } from 'src/app/_modules/text-module/text-module.component';

@Component({
  selector: 'app-add-module-tab',
  templateUrl: './add-module-tab.component.html',
  styleUrls: ['./add-module-tab.component.scss']
})
export class AddModuleTabComponent {
  @Input() connectedList: any;
  draggingOutsideSourceList = false;

  items = [
    { type: TextModuleComponent, name: 'Text Module' },
    { type: HeaderModuleComponent, name: 'Header Module' },
    { type: ImageModuleComponent, name: 'Image Module' }
  ];

  constructor() {}

  onCdkDragEntered(event: CdkDragEnter<string>) {
    this.draggingOutsideSourceList = event.container !== event.item.dropContainer;
  }
}
