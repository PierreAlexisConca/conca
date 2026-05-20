import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Cliente {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

export interface VentaProducto {
  productoId: number;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  cliente: Cliente;
  fecha: string;
  productos: VentaProducto[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class VentasMemoriaService {
  private clientes: Cliente[] = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'Ana Gómez' },
    { id: 3, nombre: 'Carlos Ruiz' }
  ];

  private productos: Producto[] = [
    { id: 1, nombre: 'Laptop', precio: 1200, stock: 10 },
    { id: 2, nombre: 'Mouse', precio: 25, stock: 50 },
    { id: 3, nombre: 'Teclado', precio: 45, stock: 30 },
    { id: 4, nombre: 'Monitor', precio: 300, stock: 15 }
  ];

  private ventas: Venta[] = [];
  private ventaId = 1;

  getClientes(): Observable<Cliente[]> {
    return of(this.clientes);
  }

  getProductos(): Observable<Producto[]> {
    return of(this.productos);
  }

  registrarVenta(venta: Omit<Venta, 'id' | 'fecha'>): Observable<Venta> {
    // Validar stock y actualizar
    for (const vp of venta.productos) {
      const prod = this.productos.find(p => p.id === vp.productoId);
      if (!prod || prod.stock < vp.cantidad) {
        throw new Error('Stock insuficiente para ' + vp.nombre);
      }
    }
    venta.productos.forEach(vp => {
      const prod = this.productos.find(p => p.id === vp.productoId);
      if (prod) prod.stock -= vp.cantidad;
    });
    const nuevaVenta: Venta = {
      ...venta,
      id: this.ventaId++,
      fecha: new Date().toISOString().split('T')[0]
    };
    this.ventas.push(nuevaVenta);
    return of(nuevaVenta);
  }

  getVentas(): Observable<Venta[]> {
    return of(this.ventas);
  }
}
