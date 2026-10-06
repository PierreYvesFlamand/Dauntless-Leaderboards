import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedService } from '../../services/shared.service';

type NAV_ITEM = {
  label: string
  icon?: string
  img?: string
  link?: string
  href?: string
  exact?: boolean
}

type NAV_GROUP = {
  title?: string
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
        { label: 'Dashboard', icon: 'fa-solid fa-gauge-high', link: '/', exact: true },
        { label: 'Statistics', icon: 'fa-solid fa-chart-pie', link: '/statistics' }
      ]
    },
    {
      title: 'Gauntlet',
      items: [
        { label: 'Seasons', img: 'img/gauntlet_icon.png', link: '/seasons' },
        { label: 'Guilds', icon: 'fa-solid fa-users', link: '/guilds' }
      ]
    },
    {
      title: 'Trials',
      items: [
        { label: 'Trials', img: 'img/trial_icon.png', link: '/trials' },
        { label: 'Players', icon: 'fa-solid fa-user', link: '/players' }
      ]
    },
    {
      title: 'Tools',
      items: [
        { label: 'Dauntless Builder', img: 'https://dauntless-builder.com/icon.png', href: 'https://dauntless-builder.com/' },
        { label: 'Level Calculator', icon: 'fa-solid fa-chart-line', link: '/level-calculator' },
        { label: 'Unseen Translator', icon: 'fa-solid fa-language', link: '/unseen-translator' }
      ]
    },
    {
      title: 'Application',
      items: [
        { label: 'About', icon: 'fa-solid fa-circle-info', link: '/about' },
        { label: 'Settings', icon: 'fa-solid fa-gear', link: '/settings' }
      ]
    },
    {
      title: 'Links',
      items: [
        { label: 'Discord', icon: 'fa-brands fa-discord', href: 'https://discord.gg/JGTVcqMDfm' },
        { label: 'Hall of Fame', icon: 'fa-solid fa-landmark', href: 'https://discord.gg/snwcPJ4xSF' },
        { label: 'Github', icon: 'fa-brands fa-github', href: 'https://github.com/PierreYvesFlamand/Dauntless-Leaderboards' }
      ]
    }
  ];

  constructor(
    public sharedService: SharedService
  ) { }
}
