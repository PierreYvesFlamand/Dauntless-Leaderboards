import { Component, EventEmitter, Output } from '@angular/core';
import { ERA, SharedService } from '../../services/shared.service';

// Pre/Post Awakening filter, stored in the same settings as the Settings page
@Component({
  selector: 'dl-era-selector',
  templateUrl: './era-selector.component.html',
  standalone: false
})
export class EraSelectorComponent {
  @Output() public eraChange = new EventEmitter<ERA>();

  // Translation keys
  public options: { value: ERA, label: string, short: string }[] = [
    { value: 'all', label: 'common.all', short: 'common.all' },
    { value: 'pre', label: 'common.preAwakening', short: 'components.eraSelector.preShort' },
    { value: 'post', label: 'common.postAwakening', short: 'components.eraSelector.postShort' }
  ];

  constructor(
    public sharedService: SharedService
  ) { }

  public select(value: ERA) {
    if (value === this.sharedService.era) return;
    this.sharedService.updateEra(value);
    this.eraChange.emit(value);
  }
}
