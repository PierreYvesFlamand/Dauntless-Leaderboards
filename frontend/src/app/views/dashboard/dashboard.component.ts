import { Component } from '@angular/core';
import { DASHBOARD_DATA } from '../../../../../backend/src/types/types';

@Component({
  selector: 'dl-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  public data?: DASHBOARD_DATA;

  ngOnInit(): void {
    fetch('http://localhost:7001/api/dashboard').then(res => res.json()).then((data: DASHBOARD_DATA) => {
      this.data = data;
    });
  }
}
