import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/pages/home/home.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard.component';
import { ProveedoresComponent } from './features/proveedores/pages/proveedores/proveedores.component';

const routes: Routes = [
  { path: '',            component: HomeComponent },
  { path: 'proveedores', component: ProveedoresComponent },
  { path: 'dashboard',   component: DashboardComponent },
  { path: '**',          redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
