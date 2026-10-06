import { Component, HostListener } from '@angular/core';

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
  public readonly creditPlayer = '<a href="/players/2" class="font-medium text-fg no-underline hover:text-accent hover:no-underline">Polfyy</a>';
  public readonly creditGuild = '<a href="/guilds/1" class="font-medium text-fg no-underline hover:text-accent hover:no-underline">ThraxEnjoyers</a>';

  constructor() {
    this.loadChangelog();
  }

  public async loadChangelog() {
    const res = await fetch('data/versions.json');
    this.changelog = await res.json();
  }

  @HostListener('document:keydown.escape')
  public onEscape() {
    this.showChangelog = false;
  }
}