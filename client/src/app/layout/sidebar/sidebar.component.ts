import { Component } from '@angular/core';
import { ActiveMenuService } from '../../services/active-menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  private activeMenuSubscription: Subscription;
  public activeMenu: string = '';

  constructor(
    private activeMenuService: ActiveMenuService
  ) {
    this.activeMenuSubscription = this.activeMenuService.activeMenuObservable.subscribe(newActiveMenu => this.activeMenu = newActiveMenu);
  }

  ngOnDestroy(): void {
    this.activeMenuSubscription.unsubscribe();
  }
}