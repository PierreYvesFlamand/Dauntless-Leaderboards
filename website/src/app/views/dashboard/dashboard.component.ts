import { Component, OnDestroy } from '@angular/core';
import { DatabaseService, WEBSITE_DASHBOARD } from '../../services/database.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'dl-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: false
})
export class DashboardComponent implements OnDestroy {
  public dashboardData?: WEBSITE_DASHBOARD;
  private dashboardDataInterval;

  constructor(
    private databaseService: DatabaseService,
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
  }
}
