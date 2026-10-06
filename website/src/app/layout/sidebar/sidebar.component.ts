import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedService } from '../../services/shared.service';

type NAV_ITEM = {
  label: string // Translation key
  icon?: string
  img?: string
  link?: string
  href?: string
  exact?: boolean
}

type NAV_GROUP = {
  title?: string // Translation key
  items: NAV_ITEM[]
}

@Component({
  selector: 'dl-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false
})
export class SidebarComponent {
  @Input() public open: boolean = false;
  @Output() public close = new EventEmitter<void>();

  public navGroups: NAV_GROUP[] = [
    {
      items: [
        { label: 'nav.dashboard', icon: 'fa-solid fa-gauge-high', link: '/', exact: true },
        { label: 'nav.statistics', icon: 'fa-solid fa-chart-pie', link: '/statistics' }
      ]
    },
    {
      title: 'nav.gauntlet',
      items: [
        { label: 'nav.seasons', img: 'img/gauntlet_icon.png', link: '/seasons' },
        { label: 'nav.guilds', icon: 'fa-solid fa-users', link: '/guilds' }
      ]
    },
    {
      title: 'nav.trials',
      items: [
        { label: 'nav.trials', img: 'img/trial_icon.png', link: '/trials' },
        { label: 'nav.players', icon: 'fa-solid fa-user', link: '/players' }
      ]
    },
    {
      title: 'nav.tools',
      items: [
        { label: 'nav.builder', img: 'https://dauntless-builder.com/icon.png', href: 'https://dauntless-builder.com/' },
        { label: 'nav.levelCalculator', icon: 'fa-solid fa-chart-line', link: '/level-calculator' },
        { label: 'nav.unseenTranslator', icon: 'fa-solid fa-language', link: '/unseen-translator' }
      ]
    },
    {
      title: 'nav.application',
      items: [
        { label: 'nav.about', icon: 'fa-solid fa-circle-info', link: '/about' },
        { label: 'nav.settings', icon: 'fa-solid fa-gear', link: '/settings' }
      ]
    },
    {
      title: 'nav.links',
      items: [
        { label: 'nav.discord', icon: 'fa-brands fa-discord', href: 'https://discord.gg/JGTVcqMDfm' },
        { label: 'nav.hallOfFame', icon: 'fa-solid fa-landmark', href: 'https://discord.gg/snwcPJ4xSF' },
        { label: 'nav.github', icon: 'fa-brands fa-github', href: 'https://github.com/PierreYvesFlamand/Dauntless-Leaderboards' }
      ]
    }
  ];

  constructor(
    public sharedService: SharedService
  ) { }
}
