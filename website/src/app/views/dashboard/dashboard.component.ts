import { Component, OnDestroy } from '@angular/core';
import { DatabaseService, WEBSITE_DASHBOARD, WEBSITE_GAUNTLET } from '../../services/database.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'dl-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: false
})
export class DashboardComponent implements OnDestroy {
  public dashboardData?: WEBSITE_DASHBOARD;
  public lastSeasons: WEBSITE_GAUNTLET[] = [];
  private dashboardDataInterval;

  constructor(
    public databaseService: DatabaseService,
    public sharedService: SharedService
  ) {
    this.fetchData();
    this.dashboardDataInterval = setInterval(this.fetchData.bind(this), 1000 * 60);
  }

  ngOnDestroy(): void {
    if (this.dashboardDataInterval) clearInterval(this.dashboardDataInterval);
  }

  private fetchData() {
    this.dashboardData = this.databaseService.data.dashboard;
    // Copy before reversing: data.gauntlets must stay in season order for the seasons page
    this.lastSeasons = [...this.databaseService.data.gauntlets].reverse().slice(0, 10);
  }
}
