import { Component, OnDestroy } from '@angular/core';
import { DASHBOARD_DATA } from '../../../../../backend/src/types/types';
import { DatabaseService } from '../../services/database.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'dl-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnDestroy {
  public dashboardData?: DASHBOARD_DATA;
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

  private async fetchData() {
    const newDashboardData = await this.databaseService.fetch<DASHBOARD_DATA>('dashboard');
    if (newDashboardData) {
      this.dashboardData = newDashboardData;
    }
  }
}
