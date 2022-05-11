import { CommonModuleComponent } from './common-module/common-module.component';
import { HeaderModuleComponent } from './header-module/header-module.component';
import { Type } from '@angular/core';

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
  metadata: any[];
};

export const modules: ModuleItem[] = [
  { name: 'Header', type: 'text', icon: 'home', tags: ['text', 'title'], component: HeaderModuleComponent }
];
