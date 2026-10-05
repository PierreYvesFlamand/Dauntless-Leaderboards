import { Component, Input } from '@angular/core';
import { SharedService } from '../../services/shared.service';

export type PLAYER_TAG = {
  weaponId: number
  secondaryWeaponId?: number
  roleId: number | null
  playerName?: string
  platformId?: number
}

// Loadout icons (weapon, secondary weapon, omnicell) + player name + platform
@Component({
  selector: 'dl-player-tag',
  templateUrl: './player-tag.component.html',
  styleUrl: './player-tag.component.scss',
  standalone: false
})
export class PlayerTagComponent {
  @Input({ required: true }) public player!: PLAYER_TAG;
  @Input() public showSecondary: boolean = false;

  constructor(
    public sharedService: SharedService
  ) { }
}
