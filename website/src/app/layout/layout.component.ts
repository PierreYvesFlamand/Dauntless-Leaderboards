import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'dl-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: false
})
export class LayoutComponent {
  constructor(
    public databaseService: DatabaseService
  ) { }
}
