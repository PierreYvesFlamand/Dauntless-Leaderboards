import { Component, OnInit } from '@angular/core';
import { DASHBOARD_DATA } from '../../../backend/src/types/types'

@Component({
  selector: 'dl-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public data?: DASHBOARD_DATA;

  ngOnInit(): void {
    fetch('http://localhost:7001/api/dashboard').then(res => res.json()).then((data: DASHBOARD_DATA) => {
      this.data = data;
    })
  }
}
