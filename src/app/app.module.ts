import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModuleComponent } from './_modules/common-module/common-module.component';
import { ImageModuleComponent } from './_modules/image-module/image-module.component';
import { ModuleContainerComponent } from './_modules/module-container/module-container.component';
import { ModuleDirective } from './_modules/_directives/module.directive';
import { ModuleManagerComponent } from './_modules/module-manager/module-manager.component';
import { ModuleOverlayComponent } from './_modules/module-overlay/module-overlay.component';
import { NewPostComponent } from './new-post/new-post.component';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    AppComponent,
    NewPostComponent,
    CommonModuleComponent,
    ModuleContainerComponent,
    ModuleDirective,
    ModuleManagerComponent,
    ImageModuleComponent,
    ModuleOverlayComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, OverlayModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
