import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AllSeasonsService } from './services/all-seasons.service';
import { ThemeService } from './services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private themeSubscription: Subscription;
  public isMainLoading: boolean = true;

  constructor(
    private ngxUiLoaderService: NgxUiLoaderService,
    private allSeasonsService: AllSeasonsService,
    private themeService: ThemeService,
  ) {//dark-mode
    this.themeSubscription = this.themeService.themeObservable.subscribe(theme => {
      if (theme === 'dark') {
        document.querySelector('body')?.classList.add('dark-mode');
      } else {
        document.querySelector('body')?.classList.remove('dark-mode');
      }
    });
    this.themeService.init();
  }

  async ngOnInit(): Promise<void> {
    this.ngxUiLoaderService.start();
    await this.allSeasonsService.fetch();
    this.ngxUiLoaderService.stop();
    this.isMainLoading = false;
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}