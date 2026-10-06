import { Component, EventEmitter, Output } from '@angular/core';
import { SharedService } from '../../services/shared.service';

// "Favorites only" switch, stored in the same setting as the Settings page
@Component({
  selector: 'dl-favorites-toggle',
  templateUrl: './favorites-toggle.component.html',
  standalone: false
})
export class FavoritesToggleComponent {
  @Output() public favoritesOnlyChange = new EventEmitter<boolean>();

  constructor(
    public sharedService: SharedService
  ) { }

  public toggle() {
    this.sharedService.updateFavoritesOnly(!this.sharedService.favoritesOnly);
    this.favoritesOnlyChange.emit(this.sharedService.favoritesOnly);
  }
}
