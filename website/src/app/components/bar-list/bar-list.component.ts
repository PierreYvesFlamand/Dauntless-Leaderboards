import { Component, Input } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { STAT_BAR_ITEM } from '../../services/statistics.service';

// Ranked horizontal bars, single hue, value at the tip
@Component({
  selector: 'dl-bar-list',
  templateUrl: './bar-list.component.html',
  styleUrl: './bar-list.component.scss',
  standalone: false
})
export class BarListComponent {
  @Input({ required: true }) public items: STAT_BAR_ITEM[] = [];
  @Input() public ranked: boolean = false;

  constructor(
    public sharedService: SharedService
  ) { }

  public get max(): number {
    return Math.max(...this.items.map(item => item.value), 1);
  }

  public ratio(item: STAT_BAR_ITEM): number {
    return Math.max(item.value / this.max, item.value > 0 ? 0.005 : 0);
  }

  // Wider label column when items show several icons (group compositions, loadouts)
  public get manyIcons(): boolean {
    return this.items.some(item => (item.icons?.length || 0) > 2);
  }
}
