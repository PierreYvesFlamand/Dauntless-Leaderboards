import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ClarityModule } from "@clr/angular";
import '@cds/core/icon/register.js';
import { ClarityIcons, cogIcon, userIcon, dashboardIcon, usersIcon } from '@cds/core/icon';
ClarityIcons.addIcons(cogIcon, userIcon, dashboardIcon, usersIcon);

import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { RouterLinkDirective } from './directives/router-link.directive';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    RouterLinkDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ClarityModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
