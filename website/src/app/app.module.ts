import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { EnhancedRouterLinkDirective } from './directives/enhanced-router-link.directive';
import { LayoutComponent } from './layout/layout.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NotFoundComponent } from './views/404/404.component';
import { SettingsComponent } from './views/settings/settings.component';
import { AboutComponent } from './views/about/about.component';
import { UnseenTranslatorComponent } from './views/unseen-translator/unseen-translator.component';
import { LevelCalculatorComponent } from './views/level-calculator/level-calculator.component';
import { SeasonsComponent } from './views/seasons/seasons.component';
import { GuildsComponent } from './views/guilds/guilds.component';
import { GuildDetailComponent } from './views/guilds/guild-detail/guild-detail.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { TrialsComponent } from './views/trials/trials.component';
import { TrialDetailComponent } from './views/trials/trial-detail/trial-detail.component';
import { PlayersComponent } from './views/players/players.component';
import { PlayerDetailComponent } from './views/players/player-detail/player-detail.component';
import { FlourishFrameComponent } from './components/flourish-frame/flourish-frame.component';

@NgModule({
  declarations: [
    AppComponent,
    EnhancedRouterLinkDirective,
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    NotFoundComponent,
    SettingsComponent,
    AboutComponent,
    UnseenTranslatorComponent,
    LevelCalculatorComponent,
    SeasonsComponent,
    GuildsComponent,
    GuildDetailComponent,
    DashboardComponent,
    TrialsComponent,
    TrialDetailComponent,
    PlayersComponent,
    PlayerDetailComponent,
    FlourishFrameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
