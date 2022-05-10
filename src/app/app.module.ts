import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModuleComponent } from './_modules/common-module/common-module.component';
import { ModuleContainerComponent } from './_modules/module-container/module-container.component';
import { ModuleDirective } from './_modules/_directives/module.directive';
import { NewPostComponent } from './new-post/new-post.component';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [AppComponent, NewPostComponent, CommonModuleComponent, ModuleContainerComponent, ModuleDirective],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, OverlayModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
