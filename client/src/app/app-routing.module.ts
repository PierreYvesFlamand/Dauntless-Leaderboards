import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { SeasonsComponent } from './views/seasons/seasons.component';
import { AboutComponent } from './views/about/about.component';
import { NotFoundComponent } from './views/404/404.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: '', component: DashboardComponent },
      {
        path: 'seasons', children: [
          { path: '', pathMatch: 'full', component: SeasonsComponent }
        ]
      },
      { path: 'about', component: AboutComponent },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
