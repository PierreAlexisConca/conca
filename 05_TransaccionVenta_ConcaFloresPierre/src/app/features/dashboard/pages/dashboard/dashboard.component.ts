import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProveedoresMemoriaService, Proveedor } from '../../../proveedores/services/proveedores-memoria.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalProveedores = 0;
  proveedoresRecientes: Proveedor[] = [];

  // Estadísticas derivadas
  dominiosUnicos = 0;
  ultimoRegistro = '—';

  constructor(private proveedoresService: ProveedoresMemoriaService) {}

  ngOnInit(): void {
    this.proveedoresService.getProveedores().subscribe(data => {
      this.totalProveedores = data.length;
      this.proveedoresRecientes = data.slice(-5).reverse(); // últimos 5

      // Dominios únicos de correo
      const dominios = data.map(p => p.correo.split('@')[1]).filter(Boolean);
      this.dominiosUnicos = new Set(dominios).size;

      // Último registro
      if (data.length > 0) {
        const ultimo = data[data.length - 1];
        this.ultimoRegistro = ultimo.empresa;
      }
    });
  }
}
