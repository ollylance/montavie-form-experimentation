import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Type } from '@angular/core';

import { CommonModuleComponent } from '../common-module/common-module.component';
import { OverlayModuleRef } from './overlay-ref';
import { modules } from '../modules';

interface ModuleItem {
  name: string;
  icon: string;
  tags: string[];
  component: Type<CommonModuleComponent>;
}

@Component({
  selector: 'app-module-overlay',
  templateUrl: './module-overlay.component.html',
  styleUrls: ['./module-overlay.component.scss']
})
export class ModuleOverlayComponent implements OnChanges {
  selectedModule!: Type<CommonModuleComponent>;
  searchText!: string;
  selectedElem: number = 0;
  filteredModules: ModuleItem[] = [];
  moduleSelected: boolean = false;

  constructor(private overlayRef: OverlayModuleRef) {
    this.searchText = this.overlayRef.data.searchText;
    this.filteredModules = this.search(this.searchText);
  }

  private search(value: string): ModuleItem[] {
    const filterValue = value.toLowerCase().substr(1);
    var filtered = new Set(modules.filter((option) => option.name.toLowerCase().includes(filterValue)));
    let subfiltered = modules.filter((option) => option.tags.some((val) => val.toLowerCase().includes(filterValue)));
    subfiltered.forEach((item) => filtered.add(item));
    return Array.from(filtered);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.filteredModules = this.search(changes['searchText'].currentValue);
  }

  selectModule(module: Type<CommonModuleComponent>) {
    this.selectedModule = module;
    this.close();
  }

  handleKeyPressed(event: KeyboardEvent) {
    if (event.key == 'ArrowDown') {
      this.selectedElem = (this.selectedElem + 1) % this.filteredModules.length;
    } else if (event.key == 'ArrowUp') {
      this.selectedElem = (this.selectedElem - 1) % this.filteredModules.length;
      if (this.selectedElem == -1) {
        this.selectedElem = this.filteredModules.length - 1;
      }
    } else if (event.key == 'Enter') {
      this.moduleSelected = true;
      this.selectedModule = this.filteredModules[this.selectedElem].component;
      this.close();
    }
  }

  close() {
    this.overlayRef.close({ moduleSelected: this.selectedModule });
  }
}
