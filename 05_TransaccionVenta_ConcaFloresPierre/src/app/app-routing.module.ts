import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/pages/home/home.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard.component';
import { VentasComponent } from './features/ventas/pages/ventas/ventas.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  // Rutas legacy eliminadas
  {
    path: 'ventas',
    component: VentasComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      // Aquí se agregarán children de dashboard de ventas
    ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
