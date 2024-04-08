import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { SeasonsComponent } from './views/seasons/seasons.component';
import { AboutComponent } from './views/about/about.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { NotFoundComponent } from './views/404/404.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    SeasonsComponent,
    AboutComponent,
    DashboardComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgxUiLoaderModule.forRoot({
      "bgsColor": "#343a40",
      "bgsOpacity": 0.5,
      "bgsPosition": "center-center",
      "bgsSize": 60,
      "bgsType": "rectangle-bounce",
      "blur": 5,
      "delay": 0,
      "fastFadeOut": true,
      "fgsColor": "#343a40",
      "fgsPosition": "center-center",
      "fgsSize": 60,
      "fgsType": "rectangle-bounce",
      "gap": 24,
      "logoPosition": "center-center",
      "logoSize": 120,
      "logoUrl": "",
      "masterLoaderId": "master",
      "overlayBorderRadius": "0",
      "overlayColor": "rgba(40, 40, 40, 0.8)",
      "pbColor": "#737f8a",
      "pbDirection": "ltr",
      "pbThickness": 3,
      "hasProgressBar": true,
      "text": "",
      "textColor": "#FFFFFF",
      "textPosition": "center-center",
      "maxTime": -1,
      "minTime": 300
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
