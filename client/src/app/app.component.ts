import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AllSeasonsService } from './services/all-seasons.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public isMainLoading: boolean = true;

  constructor(
    private ngxUiLoaderService: NgxUiLoaderService,
    private allSeasonsService: AllSeasonsService
  ) { }

  async ngOnInit(): Promise<void> {
    this.ngxUiLoaderService.start();
    await this.allSeasonsService.fetch();
    this.ngxUiLoaderService.stop();
    this.isMainLoading = false;
  }
}