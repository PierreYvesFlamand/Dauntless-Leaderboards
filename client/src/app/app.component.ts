import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { EventService } from './services/event.service';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from './services/database.service';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private themeSubscription: Subscription;
  public isLoadingDatabase: boolean = true;

  constructor(
    private ngxUiLoaderService: NgxUiLoaderService,
    private eventService: EventService,
    private languageService: LanguageService,
    private databaseService: DatabaseService
  ) {
    console.info(
      `\n%c👋 Welcome in the Console 👋%c \nDo whatever you want in here 🤷‍♂️\nIf you feel it or find an issue, please join our Discord: https://discord.gg/JGTVcqMDfm\nEnjoy your stay !\n\n%c`,
      "color:#ceb73f; background: #ceb73f33; font-size:1.5rem; padding:0.15rem; margin: 1rem auto; font-family: Rockwell, Tahoma, 'Trebuchet MS', Helvetica; border: 2px solid #ceb73f; border-radius: 4px; font-weight: bold; text-shadow: 1px 1px 1px #000000bf;",
      'font-weight: bold; font-size: 1rem;color: #ceb73f;',
      "color: #ceb73f; font-size: 0.75rem; font-family: Tahoma, 'Trebuchet MS', Helvetica;",
    );

    this.languageService.init();

    this.themeSubscription = this.eventService.themeObservable.subscribe(newValue => {
      document.querySelector('body')?.classList.add(`${newValue === 'dark' ? 'dark' : 'light'}-mode`);
      document.querySelector('body')?.classList.remove(`${newValue === 'dark' ? 'light' : 'dark'}-mode`);
    });
  }

  async ngOnInit(): Promise<void> {
    this.ngxUiLoaderService.start();
    this.eventService.init();
    await this.databaseService.init();
    this.isLoadingDatabase = false;
    this.ngxUiLoaderService.stop();
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}