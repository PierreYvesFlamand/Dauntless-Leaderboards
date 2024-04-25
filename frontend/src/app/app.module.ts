import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ClarityModule } from "@clr/angular";
import '@cds/core/icon/register.js';
import { ClarityIcons, cogIcon, userIcon, dashboardIcon, usersIcon } from '@cds/core/icon';
ClarityIcons.addIcons(cogIcon, userIcon, dashboardIcon, usersIcon);

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
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
