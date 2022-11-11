import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddModuleTabComponent } from './_tabs/add-module-tab/add-module-tab.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModuleComponent } from './_modules/common-module/common-module.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ImageModuleComponent } from './_modules/image-module/image-module.component';
import { ModuleContainerComponent } from './_modules/module-container/module-container.component';
import { ModuleDirective } from './_modules/_directives/module.directive';
import { NewPostComponent } from './new-post/new-post.component';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { TabComponent } from './_tabs/tab/tab.component';
import { TabsComponent } from './_tabs/tabs/tabs.component';
import { TextModuleComponent } from './_modules/text-module/text-module.component';

@NgModule({
  declarations: [
    AppComponent,
    NewPostComponent,
    CommonModuleComponent,
    ModuleContainerComponent,
    ModuleDirective,
    ImageModuleComponent,
    TextModuleComponent,
    TabsComponent,
    TabComponent,
    AddModuleTabComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    DragDropModule,
    PortalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
