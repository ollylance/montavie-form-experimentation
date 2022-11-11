import { ElementRef, Type } from '@angular/core';

import { CommonModuleComponent } from './common-module/common-module.component';
import { HeaderModuleComponent } from './header-module/header-module.component';
import { ImageModuleComponent } from './image-module/image-module.component';
import { TextModuleComponent } from './text-module/text-module.component';

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
  { name: 'Text', type: 'text', icon: 'letters', tags: ['text', 'body', 'name'], component: TextModuleComponent },
  { name: 'Header', type: 'text', icon: 'home', tags: ['text', 'title'], component: HeaderModuleComponent },
  { name: 'Image', type: 'image', icon: 'image', tags: ['picture', 'image', 'photo'], component: ImageModuleComponent }
];

export function mergeInterval(intervals: [number, number][], newInterval: [number, number]) {
  // add in newInterval into the right place, keep track of index
  let inserted = false;
  let i = 0;
  while (!inserted && i < intervals.length) {
    if (intervals[i][0] > newInterval[0]) {
      intervals.splice(i, 0, newInterval);
      inserted = true;
    } else {
      i += 1;
    }
  }
  if (!inserted) {
    intervals.push(newInterval);
  }

  let merged: [number, number][] = [];

  for (let j = 0; j < intervals.length; j++) {
    let interval = intervals[i];
    let previous = merged[merged.length - 1];
    if (merged.length == 0 || previous[1] < interval[0]) {
      // current value falls out of previous range.
      merged.push(interval);
    } else {
      if (previous[1] > interval[1]) {
        // current interval is encapsulated by previous.
        if (j - 1 == i) {
          // previous interval is the new interval, that encapsulates existing interval.
          // Make all bold.
          merged[merged.length - 1] = interval;
          console.log('hello');
        } else {
          let last = merged.pop()!;
          if (interval[0] != last[0]) {
            merged.push([last[0], interval[0]]);
          }
          if (interval[1] != last[1]) {
            merged.push([interval[1], last[1]]);
          }
        }
      } else if (previous[1] == interval[1] && previous[0] == interval[0]) {
        // full interval exists, unbold all of it, including previous.
        merged.splice(merged.length - 1, 1);
      } else {
        merged[merged.length - 1][1] = interval[1];
      }
    }
  }
  return merged;
}

export function renderInnerHtml(info: ModuleFormItem, parentNode: ElementRef<any>) {
  // TODO(ollylance): check for module type
  // info.text = 'Oliver is so cool';
  // info.markups.bold = [
  //   [1, 3],
  //   [4, 6]
  // ];
  let types = {
    bold: ['<b>', '</b>']
  };

  let inner = info.text;
  let currExtra = 0;
  for (let interval of info.markups.bold) {
    inner = inner.slice(0, interval[0] + currExtra) + types.bold[0] + inner.slice(interval[0] + currExtra);
    currExtra += types.bold[0].length;
    inner = inner.slice(0, interval[1] + currExtra) + types.bold[1] + inner.slice(interval[1] + currExtra);
    currExtra += types.bold[1].length;
  }
  return inner;

  // let elem = document.createElement('p');
  // elem.className = 'editable';
  // elem.innerHTML = '<p>hello world</p>';
  // elem.setAttribute('contenteditable', 'true');
  // console.log(elem);
}
