import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';

// Internal links (<a href="/...">) inside [innerHTML] content (e.g. translated texts) navigate without reloading the app
@Directive({
  selector: '[htmlRouterLinks]',
  standalone: false
})
export class HtmlRouterLinksDirective {
  constructor(
    private router: Router
  ) { }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const link = (event.target as HTMLElement).closest('a');
    const href = link?.getAttribute('href');
    // External link, or new tab wanted: let the browser handle it
    if (!href?.startsWith('/') || link?.target || event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;

    event.preventDefault();
    this.router.navigateByUrl(href);
  }
}
