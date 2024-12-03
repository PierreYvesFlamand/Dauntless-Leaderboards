import { Component } from '@angular/core';
import { SharedService } from './services/shared.service';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'dl-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false
})
export class AppComponent {
  constructor(
    private sharedService: SharedService,
    public databaseService: DatabaseService
  ) {
    console.info(
      `\n%c👋 Welcome in the Console 👋%c \nDo whatever you want in here 🤷‍♂️\nIf you feel it or find an issue, please join our Discord: https://discord.gg/JGTVcqMDfm\nEnjoy your stay !\n\n%c`,
      "color:#ceb73f; background: #ceb73f33; font-size:1.5rem; padding:0.15rem; margin: 1rem auto; font-family: Rockwell, Tahoma, 'Trebuchet MS', Helvetica; border: 2px solid #ceb73f; border-radius: 4px; font-weight: bold; text-shadow: 1px 1px 1px #000000bf;",
      'font-weight: bold; font-size: 1rem;color: #ceb73f;',
      "color: #ceb73f; font-size: 0.75rem; font-family: Tahoma, 'Trebuchet MS', Helvetica;",
    );

    this.sharedService.theme$.subscribe(value => {
      document.querySelector('body')?.classList.add(`${value === 'dark' ? 'dark' : 'light'}-mode`);
      document.querySelector('body')?.classList.remove(`${value === 'dark' ? 'light' : 'dark'}-mode`);
    });
    this.sharedService.init();
    this.databaseService.loadData();
  }
}