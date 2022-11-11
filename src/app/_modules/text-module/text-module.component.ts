import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { ModuleFormItem, mergeInterval, renderInnerHtml } from '../modules';

import { CommonModuleComponent } from '../common-module/common-module.component';
import { FormBuilder } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-text-module',
  templateUrl: './text-module.component.html',
  styleUrls: ['./text-module.component.scss']
})
export class TextModuleComponent extends CommonModuleComponent implements OnInit, AfterViewInit {
  @ViewChild('editable') editable!: ElementRef;
  moduleText: string = '';

  @ViewChild('highlightSettings') highlightSettings!: TemplateRef<any>;
  @ViewChild('moduleSettings') moduleSettings!: TemplateRef<any>;
  highlightPortal!: TemplatePortal<any>;
  modulePortal!: TemplatePortal<any>;

  private host!: DomPortalOutlet;

  constructor(
    public override _fb: FormBuilder,
    private _renderer: Renderer2,
    private _viewContainerRef: ViewContainerRef
  ) {
    super(_fb);
  }

  ngOnInit(): void {
    this.moduleForm.valueChanges.subscribe((val) => {
      this.onChange(val);
    });
  }

  ngAfterViewInit(): void {
    this.editable.nativeElement.focus();
    this._renderer.listen(this.editable.nativeElement, 'input', () => {
      let text: string = this.editable.nativeElement.innerText;
      this.moduleForm.get('text')?.setValue(text);
    });

    this._renderer.listen(this.editable.nativeElement, 'mouseup', () => {
      this.handlePortals();
    });
    this._renderer.listen(this.editable.nativeElement, 'keyup', () => {
      this.handlePortals();
    });

    // Set up Portals for highlighting and All settings
    this.modulePortal = new TemplatePortal(this.moduleSettings, this._viewContainerRef);
    this.highlightPortal = new TemplatePortal(this.highlightSettings, this._viewContainerRef);

    let settings = document.querySelector('#module-settings');
    if (settings) {
      this.host = new DomPortalOutlet(settings);
      this.host.attach(this.modulePortal);
    }
  }

  override writeValue(value: ModuleFormItem) {
    if (this.editable) {
      this.editable.nativeElement.textContent = value.text;
    }
    this.moduleText = value.text;
    this.moduleForm.patchValue(value);
  }

  settingsMouseDown(e: any) {
    e.preventDefault();
  }

  boldSelection() {
    // TODO(ollylance): update markups on text deletion
    let currentModuleMarkups = this.moduleForm.get('markups')?.value;

    var offset = 0;
    var selection: any = window.getSelection()!;
    var range = selection.getRangeAt(0);
    var start = range.startOffset;
    var end = range.endOffset;
    // From https://gist.github.com/endpnt/926585
    if (selection.baseNode.parentNode.hasChildNodes()) {
      for (var i = 0; selection.baseNode!.parentNode.childNodes.length > i; i++) {
        var cnode = selection.baseNode!.parentNode.childNodes[i];
        if (cnode.nodeType == document.TEXT_NODE) {
          if (offset + cnode.length > start) {
            break;
          }
          offset = offset + cnode.length;
        }
        if (cnode.nodeType == document.ELEMENT_NODE) {
          if (offset + cnode.textContent.length > start) {
            break;
          }
          offset = offset + cnode.textContent.length;
        }
      }
    }

    start = start + offset;
    end = end + offset;

    let newIntervals = mergeInterval(currentModuleMarkups.bold, [start, end]);
    currentModuleMarkups.bold = newIntervals;

    console.log(newIntervals);
    this.moduleForm.get('markups')?.setValue(currentModuleMarkups);

    /* console.log(renderInnerHtml(this.moduleForm.value, this.editable)); */
    console.log(this.editable);
  }

  isHighlighting() {
    return window.getSelection && window.getSelection()!.type === 'Range';
  }

  handlePortals() {
    if (this.host) {
      if (this.isHighlighting()) {
        this.host.detach();
        this.host.attach(this.highlightPortal);
      } else {
        this.host.detach();
        this.host.attach(this.modulePortal);
      }
    }
  }

  onFocus(event: any) {
    this.handlePortals();
  }

  onBlur(event: any) {
    this.host.detach();
  }
}
