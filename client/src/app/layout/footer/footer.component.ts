import { Component } from '@angular/core';

type Changelog = Array<{
  version: string,
  changelogItems: Array<string>
}>;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public changelog: Changelog = [];


  constructor() {
    this.loadChangelog();
  }

  public async loadChangelog() {
    const res = await fetch(`https://www.dauntless-leaderboards.com/data/versions.json`);
    this.changelog = await res.json();
  }
}