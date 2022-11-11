import { Component, ContentChildren, EventEmitter, Output, QueryList } from '@angular/core';

import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
  @Output() navOpened = new EventEmitter<boolean>();

  selectTab(tab: TabComponent) {
    this.tabs.toArray().forEach((t) => {
      if (tab != t) {
        t.active = false;
      }
    });

    // toggle the clicked tab.
    tab.active = !tab.active;
    this.navOpened.emit(tab.active);
  }
}
