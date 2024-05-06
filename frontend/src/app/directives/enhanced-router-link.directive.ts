import { Directive, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[enhancedRouterLink]'
})
export class EnhancedRouterLinkDirective {
  @Input('enhancedRouterLink') linkParams: string = '';

  constructor(
    private router: Router
  ) { }

  @HostListener('mouseup', ['$event'])
  onClick(event: MouseEvent): void {
    if (event.ctrlKey || event.button === 1) {
      const url = this.router.serializeUrl(this.router.createUrlTree([this.linkParams]));
      window.open(url, '_blank');
    } else {
      this.router.navigate([this.linkParams]);
    }
  }

  @HostListener('mousedown', ['$event'])
  preventMiddleClickScroll(ev: MouseEvent) {
    if (ev.button === 1) {
      ev.preventDefault();
    }
  }
}