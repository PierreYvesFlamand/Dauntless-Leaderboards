import { Component } from '@angular/core';
import { TitleService } from '../../services/title.service';
import { ActiveMenuService } from '../../services/active-menu.service';

@Component({
  selector: 'app-404',
  templateUrl: './404.component.html',
  styleUrls: ['./404.component.scss']
})
export class NotFoundComponent {
    constructor(
      private titleService: TitleService,
      private activeMenuService: ActiveMenuService
    ) {
      this.titleService.updateTitle('404 Page not found');
      this.activeMenuService.updateActiveMenu('');
    }
}