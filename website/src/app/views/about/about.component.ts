import { Component } from '@angular/core';

@Component({
  selector: 'dl-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: false
})
export class AboutComponent {
  // Inline markup inserted in the translated sentences (names are not translated)
  public readonly websiteName = '<b>Dauntless Leaderboard</b>';
  public readonly discordLink = '<a href="https://discord.gg/JGTVcqMDfm" target="_blank">discord</a>';
  public readonly hallOfFameName = '<b>Dauntless Hall of Fame</b>';
  public readonly hallOfFameDiscordLink = '<a href="https://discord.gg/snwcPJ4xSF" target="_blank" rel="noopener">discord</a>';
}
