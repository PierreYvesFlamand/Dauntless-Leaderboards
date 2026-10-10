import { Directive, HostListener, Input } from '@angular/core';
import { Params, Router } from '@angular/router';

@Directive({
  selector: '[enhancedRouterLink]',
  standalone: false
})
export class EnhancedRouterLinkDirective {
  @Input('enhancedRouterLink') linkParams: string = '';
  @Input() queryParams?: Params;

  constructor(
    private router: Router
  ) { }

  @HostListener('mouseup', ['$event'])
  onClick(event: MouseEvent): void {
    // No link, or not a left/middle click (right = context menu, 3/4 = browser back/forward)
    if (!this.linkParams || (event.button !== 0 && event.button !== 1)) return;

    // Nested links (e.g. a cell inside a clickable row): the innermost one wins
    event.stopPropagation();

    if (event.ctrlKey || event.button === 1) {
      const url = this.router.serializeUrl(this.router.createUrlTree([this.linkParams], { queryParams: this.queryParams }));
      window.open(url, '_blank');
    } else {
      this.router.navigate([this.linkParams], { queryParams: this.queryParams });
    }
  }

  @HostListener('mousedown', ['$event'])
  preventMiddleClickScroll(ev: MouseEvent) {
    if (ev.button === 1) {
      ev.preventDefault();
    }
  }
}
