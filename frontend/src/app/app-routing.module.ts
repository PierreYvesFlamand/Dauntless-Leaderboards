import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { GuildsComponent } from './views/guilds/guilds.component';
import { SeasonsComponent } from './views/seasons/seasons.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: '', component: DashboardComponent },

      { path: 'seasons', redirectTo: 'seasons/-1' },
      { path: 'seasons/:id', component: SeasonsComponent },

      { path: 'guilds', component: GuildsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
