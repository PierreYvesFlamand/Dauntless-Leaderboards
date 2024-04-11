import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { EventService } from './services/event.service';
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
    private eventService: EventService,
  ) {
    this.themeSubscription = this.eventService.themeObservable.subscribe(theme => {
      if (theme === 'dark') {
        document.querySelector('body')?.classList.add('dark-mode');
      } else {
        document.querySelector('body')?.classList.remove('dark-mode');
      }
    });

    this.eventService.init();
  }

  async ngOnInit(): Promise<void> {
    this.ngxUiLoaderService.start();
    await this.eventService.init();
    this.ngxUiLoaderService.stop();
    this.isMainLoading = false;
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}