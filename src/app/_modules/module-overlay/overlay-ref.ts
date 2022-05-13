import { TemplateRef, Type } from '@angular/core';

import { OverlayParams } from './overlay.service';
import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

export type OverlayCloseEvent<T = any> = {
  type: 'backdropClick' | 'close';
  data: T | undefined;
};

export type OverlayContent = TemplateRef<any> | Type<any> | string;

export class OverlayModuleRef<T = any> {
  private afterClosed = new Subject<OverlayCloseEvent<T>>();
  afterClosed$ = this.afterClosed.asObservable();

  constructor(public overlay: OverlayRef, public data: T) {
    overlay.backdropClick().subscribe(() => {
      this._close('backdropClick', data);
    });
  }

  close(data?: T) {
    this._close('close', data);
  }

  private _close(type: OverlayCloseEvent['type'], data?: T) {
    this.overlay.dispose();
    this.afterClosed.next({
      type,
      data
    });
    this.afterClosed.complete();
  }
}
