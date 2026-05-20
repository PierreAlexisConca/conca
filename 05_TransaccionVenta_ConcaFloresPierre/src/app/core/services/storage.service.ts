import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private ventasKey = 'ventas';
  // private clientesKey = 'clientes';
  // private productosKey = 'productos';
  getVentas(): any[] {
    return JSON.parse(localStorage.getItem(this.ventasKey) || '[]');
  }
  saveVentas(ventas: any[]) {
    localStorage.setItem(this.ventasKey, JSON.stringify(ventas));
  }
  // Métodos para clientes y productos se agregarán aquí
}
