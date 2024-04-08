import { Component, OnDestroy } from '@angular/core';
import { TitleService } from '../services/title.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnDestroy {
  private titleSubscription: Subscription;
  public title: string = '';

  constructor(
    private titleService: TitleService
  ) {
    this.titleSubscription = this.titleService.titleObservable.subscribe(newTitle => this.title = newTitle);
  }

  ngOnDestroy(): void {
    this.titleSubscription.unsubscribe();
  }
}
