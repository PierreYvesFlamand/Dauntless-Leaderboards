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
  private allSeasonSubscription: Subscription;
  private allGuildsSubscription: Subscription;
  public guild?: GUILD_DETAIL;

  public numberOfSeasons: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {
    this.eventService.updateActiveMenu('');

    const guildTag = this.activatedRoute?.snapshot.params['guildTag'];

    this.allSeasonSubscription = this.eventService.allSeasonsObservable.subscribe(data => this.numberOfSeasons = Object.keys(data).length);
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
    this.allSeasonSubscription.unsubscribe();
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
      "DFR1": {
        imageName: 'DFR1.gif',
        discordLink: 'https://discord.gg/tTVBmWzK2y',
        description: `
<p>
  🇫🇷 Notre histoire
  Notre guilde au sens Alpha du terme a vu le jour en 2018 avec la guilde [DFR1] Les béliers.<br/>
  Nous étions la 1e guilde francophone la plus active grâce à la limite infinie du nombre de membres dans la guilde, nous étions auparavant 1400+ membres et trouvions facilement des joueurs en jeu avec le canal de guilde. <br/>
  Les temps et les mises à jour ont passé pour laisser place à un système à 100 place Max. Nous avons donc dû revoir complètement la guilde est son intérêt.<br/><br/>
  Avec l'arrivée du Gauntlet nous avons sur la 1e saison pas mal joué mais nous n'avions pas trop forcé voyant comment les guildes internationales  dominaient la scène.<br/>
  Après plusieurs saisons passées et la motivation à nouveau présente, c'est en saison 6 (août 2023) que nous reprenons du poil de la bête.<br/>
  C'est à dire : Nettoyage complet de la guilde par une dissolution suivi d'une recréation instantanée pour palier au bug des "Ghost Members"...<br/><br/>
  Nous avons actuellement un nouveau système pour suivre nos membres qui participent (ou non) et ainsi faire en sorte que chaque personne ne se sentent pas exploité par les autres membres inactifs.<br/>
  (Nous avions auparavant une politique de recrutement plus que laxiste et au final personne ne participait. Nous avons donc changé notre fusil d'épaule et proposons donc ce nouveau concept qui pour l'instant marche bien puisqu'une semaine après nous sommes montés Top20 au palier 135.<br/>
  Depuis, nos classement ce sont stabilisés dans le Top20<br/><br/>
  <u>Pourquoi nous</u>?<br/>
  Eh bien comme dit précédemment, fort d'un discord communautaire FR de ~7000 membres, nous avons donc un pilier central d'activité et fait de notre guilde un endroit propice pour tout francophone qui se respecte.
  Vous l'avez donc compris, notre guilde n'est pas prête de rendre l'âme et si vous recherchez une guilde FR c'est LA guilde à ne pas rater.
</p>
    `,
        requirements: `
<ul>
  <li>📌 Parler FR,</li>
  <li>📌 Utiliser discord</li>
  <li>📌 Avoir un minimum de stuff (Stuff requis disponible sur notre discord dans la section #guildes)</li>
  <li>📌 Participer au gauntlet, le tout dans la joie et la bonne humeur 😄</li>
</ul>
    `,
        howToJoin: `
<p>
  🇫🇷 Il suffit de rejoindre notre discord, de valider le règlement, assigner vos rôles et passer par le canal #guildes pour ensuite postuler avec notre formulaire directement sur le canal de recrutement.
</p>
    `
      },
      "__THRAAX": {
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