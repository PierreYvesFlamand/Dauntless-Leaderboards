import { Component, Input, OnDestroy } from '@angular/core';
import { ALL_GUILDS, GUILD_DETAIL } from '../../../../../../scripts/src/types';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-guild-detail',
  templateUrl: './guild-detail.component.html',
  styleUrls: ['./guild-detail.component.scss']
})
export class GuildDetailComponent implements OnDestroy {
  private allGuildsSubscription: Subscription;
  public guild?: GUILD_DETAIL;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {
    this.eventService.updateActiveMenu('');

    const guildTag = this.activatedRoute?.snapshot.params['guildTag'];

    this.allGuildsSubscription = this.eventService.allGuildsObservable.subscribe(data => {
      this.guild = data.find(g => g.guildNameplate.toLowerCase() === guildTag.toLowerCase());
      if (!this.guild) {
        this.router.navigate(['guilds']);
      } else {
        this.eventService.updateTitle(`${this.guild.guildName} [${this.guild.guildNameplate}]`);
      }
    });
  }

  ngOnDestroy(): void {
    this.allGuildsSubscription.unsubscribe();
  }

  public getSeasonNumber(seasonId?: string): number {
    if (!seasonId) return 69;
    return Number(seasonId.slice(15));
  }

  public guildsDetail: { [key in string]: {
    imageName?: string,
    discordLink?: string,
    description?: string,
    requirements?: string,
    howToJoin?: string
  } } = {
      "THRAAX": {
        imageName: 'THRAAX.jpg',
        discordLink: 'https://google.be',
        description: `
<p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita hic fugit fugiat modi, earum ab maiores
    dolorem accusamus numquam adipisci repudiandae ipsum nulla temporibus pariatur a aut, at.
    <br>
    Corrupti quia facilis obcaecati
    reprehenderit impedit, quam aliquid tempora sed. Nulla totam quod molestias. Deleniti consequatur provident
    vitae.
</p>
<p>
    Pariatur neque fugit laborum
    exercitationem cupiditate harum laudantium quaerat, ipsum magnam consequuntur dolorem totam, impedit magni
    commodi quod. Molestias nemo illum explicabo expedita enim optio blanditiis, a perferendis cupiditate, qui
    amet cumque id ipsum alias fugit quae quos nulla rerum voluptatem incidunt voluptate recusandae aliquam?
    Nisi officiis.
</p>
        `,
        requirements: `
<ul>
    <li>Lorem, ipsum dolor</li>
    <li>Lorem, ipsum dolor</li>
    <li>Lorem, ipsum dolor</li>
    <li>Lorem, ipsum dolor</li>
    <li>Lorem, ipsum dolor</li>
</ul>
        `,
        howToJoin: `
<p>
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla architecto <a href="https://google.be" target="_blank">fill out our form</a> veritatis sunt cumque praesentium
    vitae repellendus quas voluptatibus. Iusto impedit <a href="https://google.be" target="_blank">join our discord</a> vero quae saepe nisi? Quasi rerum deleniti asperiores
    accusamus provident?
</p>
        `
      }
    };
}