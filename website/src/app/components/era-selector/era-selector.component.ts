import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ERA, ERAS, ERA_IDS, SharedService } from '../../services/shared.service';

// Turns each era on/off (at least one stays on)
// Without [selected]: stored in the same settings as the Settings page
// With [selected]: only emits the new selection (e.g. statistics, where eras live in the query params)
@Component({
  selector: 'dl-era-selector',
  templateUrl: './era-selector.component.html',
  standalone: false
})
export class EraSelectorComponent {
  @Input() public selected?: ERA[];
  @Output() public eraChange = new EventEmitter<ERA[]>();

  public readonly eras = ERAS;

  constructor(
    public sharedService: SharedService
  ) { }

  public get shownEras(): ERA[] {
    return this.selected || this.sharedService.shownEras;
  }

  public isShown(era: ERA): boolean {
    return this.shownEras.includes(era);
  }

  public isOnlyShown(era: ERA): boolean {
    return this.shownEras.length === 1 && this.isShown(era);
  }

  public toggle(era: ERA) {
    if (this.isOnlyShown(era)) return;
    const eras = ERA_IDS.filter(id => id === era ? !this.isShown(id) : this.isShown(id));
    if (!this.selected) this.sharedService.updateShownEras(eras);
    this.eraChange.emit(eras);
  }
}
