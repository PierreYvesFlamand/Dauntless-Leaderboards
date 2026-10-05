import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'dl-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: false
})
export class LayoutComponent {
  // Mobile only: sidebar is always visible from lg breakpoint
  public sidebarOpen: boolean = false;

  // Scroll container from lg (app shell), the window below
  @ViewChild('scrollArea') private scrollArea?: ElementRef<HTMLElement>;
  private lastPath: string = '';

  constructor(
    public databaseService: DatabaseService,
    private router: Router
  ) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.sidebarOpen = false;

      // Back to top on a new page only, not when just the query params change (filters)
      const path = event.urlAfterRedirects.split('?')[0];
      if (path === this.lastPath) return;
      this.lastPath = path;
      window.scrollTo({ top: 0 });
      this.scrollArea?.nativeElement.scrollTo({ top: 0 });
    });
  }

  @HostListener('document:keydown.escape')
  public onEscape() {
    this.sidebarOpen = false;
  }
}
