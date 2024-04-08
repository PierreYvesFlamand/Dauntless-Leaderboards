import { Component } from '@angular/core';
import { TitleService } from '../../services/title.service';
import { ActiveMenuService } from '../../services/active-menu.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
    constructor(
      private titleService: TitleService,
      private activeMenuService: ActiveMenuService
    ) {
      this.titleService.updateTitle('About');
      this.activeMenuService.updateActiveMenu('about');
    }
}