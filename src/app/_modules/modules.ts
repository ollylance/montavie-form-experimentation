import { ElementRef, Type } from '@angular/core';

import { CommonModuleComponent } from './common-module/common-module.component';
import { HeaderModuleComponent } from './header-module/header-module.component';
import { ImageModuleComponent } from './image-module/image-module.component';

// import { TextModuleComponent } from './text-module/text-module.component';

type ModuleItem = {
  component: Type<CommonModuleComponent>;
  name: string;
  type: string;
  icon: string;
  tags: string[];
};

export type ModuleFormItem = {
  type: Type<CommonModuleComponent>;
  text: string;
  markups: any;
  metadata: Map<string, any>;
  id: string;
};

export const modules: ModuleItem[] = [
  // { name: 'Text', type: 'text', icon: 'letters', tags: ['text', 'body', 'name'], component: TextModuleComponent },
  { name: 'Header', type: 'text', icon: 'home', tags: ['text', 'title'], component: HeaderModuleComponent },
  { name: 'Image', type: 'image', icon: 'image', tags: ['picture', 'image', 'photo'], component: ImageModuleComponent }
];
