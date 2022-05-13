import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ConnectionPositionPair, Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { Injectable, Injector } from '@angular/core';

import { ModuleOverlayComponent } from './module-overlay.component';
import { OverlayModuleRef } from './overlay-ref';

export type OverlayParams = {
  origin: HTMLElement;
  text?: string;
  width?: string | number;
  height: string | number;
};

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open({ origin, width, height }: OverlayParams) {
    const overlayRef = this.overlay.create(this.getOverlayConfig({ origin, width, height }));
    const popoverRef = new OverlayModuleRef(overlayRef, { searchText: 'he' });

    const injector = this.createInjector(popoverRef, this.injector);
    overlayRef.attach(new ComponentPortal(ModuleOverlayComponent, null, injector));

    return popoverRef;
  }

  createInjector(overlayRef: OverlayModuleRef, injector: Injector) {
    const tokens = new WeakMap([[OverlayModuleRef, overlayRef]]);
    return new PortalInjector(injector, tokens);
  }

  private getOverlayConfig({ origin, width, height }: any): OverlayConfig {
    return new OverlayConfig({
      width,
      height,
      hasBackdrop: true,
      backdropClass: 'popover-backdrop',
      positionStrategy: this.getOverlayPosition(origin),
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  private getOverlayPosition(origin: HTMLElement): PositionStrategy {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(this.getPositions())
      .withPush(false);

    return positionStrategy;
  }

  private getPositions(): ConnectionPositionPair[] {
    return [
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom'
      },
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top'
      }
    ];
  }
}
