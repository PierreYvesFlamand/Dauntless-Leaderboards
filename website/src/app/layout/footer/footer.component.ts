import { Component } from '@angular/core';

type Changelog = Array<{
  version: string,
  date: string,
  changelogItems: Array<string>
}>;

@Component({
  selector: 'dl-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: false
})
export class FooterComponent {
  public showChangelog: boolean = false;
  public changelog: Changelog = [];

  constructor() {
    this.loadChangelog();
  }

  public async loadChangelog() {
    const res = await fetch('data/versions.json');
    this.changelog = await res.json();
  }
}