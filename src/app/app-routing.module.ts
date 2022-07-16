import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

const routes: Routes = [
  {path:'',component:PortfolioComponent,pathMatch:"full"},
  {path:'port',redirectTo:'',pathMatch:"full"},
  {path:'login',loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path:'purchase',loadChildren: () => import('./purchase/purchase.module').then(m=> m.PurchaseModule),canActivate:[AuthGuard]},
  {path:'home',component:HomeComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
