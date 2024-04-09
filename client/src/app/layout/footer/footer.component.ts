import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

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
    const res = await fetch(`${environment.backendUrl}/data/versions.json`);
    this.changelog = await res.json();
  }
}