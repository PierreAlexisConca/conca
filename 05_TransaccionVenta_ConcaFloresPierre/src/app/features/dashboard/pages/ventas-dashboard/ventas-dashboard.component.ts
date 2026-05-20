import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-ventas-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ventas-dashboard.component.html',
  styleUrls: ['./ventas-dashboard.component.css']
})
export class VentasDashboardComponent {
  totalVentas = 0;
  totalClientes = 0;
  totalProductos = 0;

  constructor(private storage: StorageService) {}

  ngOnInit() {
    const ventas = this.storage.getVentas();
    this.totalVentas = ventas.length;
    this.totalClientes = new Set(ventas.map((v: any) => v.cliente)).size;
    this.totalProductos = ventas.reduce((acc: number, v: any) => acc + (v.productos?.length || 0), 0);
  }
}
