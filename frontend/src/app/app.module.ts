import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { RouterLinkDirective } from './directives/router-link.directive';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { SeasonsComponent } from './views/seasons/seasons.component';
import { FlourishFrameComponent } from './components/flourish-frame/flourish-frame.component';
import { NotFoundComponent } from './views/404/404.component';
import { SettingsComponent } from './views/settings/settings.component';
import { AboutComponent } from './views/about/about.component';
import { GuildsComponent } from './views/guilds/guilds.component';
import { GuildDetailComponent } from './views/guilds/guild-detail/guild-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    RouterLinkDirective,
    SidebarComponent,
    SeasonsComponent,
    FlourishFrameComponent,
    NotFoundComponent,
    SettingsComponent,
    AboutComponent,
    GuildsComponent,
    GuildDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
