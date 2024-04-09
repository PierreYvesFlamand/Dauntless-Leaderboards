import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private themeSubscription: Subscription;
  public theme: 'light' | 'dark' = 'light';

  constructor(
    public themeService: ThemeService
  ) {
    this.themeSubscription = this.themeService.themeObservable.subscribe(newTheme => this.theme = newTheme);
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}