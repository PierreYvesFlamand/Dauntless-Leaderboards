import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

type Changelog = Array<{
  version: string,
  date: string,
  changelogItems: Array<string>
}>;

@Component({
  selector: 'dl-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public showChangelog: boolean = false;
  public changelog: Changelog = [];

  constructor() {
    this.loadChangelog();
  }

  public async loadChangelog() {
    const res = await fetch(`${environment.backendUrl}/assets/versions.json`);
    this.changelog = await res.json();
  }
}