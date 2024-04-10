import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { SeasonsComponent } from './views/seasons/seasons.component';
import { GuildsComponent } from './views/guilds/guilds.component';
import { AboutComponent } from './views/about/about.component';
import { NotFoundComponent } from './views/404/404.component';
import { GuildDetailComponent } from './views/guilds/guild-detail/guild-detail.component';
import { ExportComponent } from './views/export/export.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: '', component: DashboardComponent },
      {
        path: 'seasons', component: SeasonsComponent, children: [
          {
            path: ':gauntletId', component: SeasonsComponent, children: [
              { path: 'chart', component: SeasonsComponent, data: { showChart: true } }
            ]
          }
        ]
      },
      {
        path: 'guilds', component: GuildsComponent, children: [
          { path: ':guildTag', component: GuildDetailComponent }
        ]
      },
      { path: 'about', component: AboutComponent },
      { path: 'export', component: ExportComponent },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
