import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { NotFoundComponent } from './views/404/404.component';
import { ExportComponent } from './views/export/export.component';
import { AboutComponent } from './views/about/about.component';
import { SettingsComponent } from './views/settings/settings.component';
import { SeasonsComponent } from './views/seasons/seasons.component';
import { GuildsComponent } from './views/guilds/guilds.component';
import { GuildDetailComponent } from './views/guilds/guild-detail/guild-detail.component';
import { TrialsComponent } from './views/trials/trials.component';
import { TrialDetailComponent } from './views/trials/trial-detail/trial-detail.component';
import { PlayersComponent } from './views/players/players.component';
import { PlayerDetailComponent } from './views/players/players/player-detail/player-detail.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: '', component: DashboardComponent },

      { path: 'seasons', component: SeasonsComponent },
      { path: 'seasons/:gauntletId', component: SeasonsComponent },
      { path: 'seasons/:gauntletId/chart', component: SeasonsComponent, data: { showChart: true } },

      { path: 'guilds', component: GuildsComponent },
      { path: 'guilds/:guildTag', component: GuildDetailComponent },

      { path: 'trials', component: TrialsComponent },
      { path: 'trials/:week', component: TrialDetailComponent },

      { path: 'players', component: PlayersComponent },
      { path: 'players/:name', component: PlayerDetailComponent },

      { path: 'about', component: AboutComponent },
      { path: 'settings', component: SettingsComponent },

      { path: 'export', component: ExportComponent },

      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
