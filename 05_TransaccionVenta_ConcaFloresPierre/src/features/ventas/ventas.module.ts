import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroVentaPage } from './pages/registro/registro-venta.page';
import { ListadoVentasPage } from './pages/listado/listado-ventas.page';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: []
})
export class VentasModule {}
