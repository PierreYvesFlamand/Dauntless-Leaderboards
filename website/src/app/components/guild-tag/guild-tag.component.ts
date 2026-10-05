import { Component, Input } from '@angular/core';
import { SharedService } from '../../services/shared.service';

// Guild icon + name + [TAG]
@Component({
  selector: 'dl-guild-tag',
  templateUrl: './guild-tag.component.html',
  styleUrl: './guild-tag.component.scss',
  standalone: false
})
export class GuildTagComponent {
  @Input() public iconFilename: string | null = null;
  @Input() public name: string = '';
  @Input() public tag: string = '';

  constructor(
    public sharedService: SharedService
  ) { }
}
