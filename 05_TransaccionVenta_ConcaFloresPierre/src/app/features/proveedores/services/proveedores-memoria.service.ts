import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Proveedor {
  id: number;
  empresa: string;
  contacto: string;
  telefono: string;
  correo: string;
  fechaRegistro: string;
}

@Injectable({ providedIn: 'root' })
export class ProveedoresMemoriaService {

  private proveedores: Proveedor[] = [
    {
      id: 1,
      empresa: 'TechSupplies SAC',
      contacto: 'Carlos Mendoza',
      telefono: '987654321',
      correo: 'carlos@techsupplies.com',
      fechaRegistro: '2025-01-15'
    },
    {
      id: 2,
      empresa: 'Distribuidora Lima',
      contacto: 'Ana Torres',
      telefono: '912345678',
      correo: 'ana@distlima.com',
      fechaRegistro: '2025-03-10'
    },
    {
      id: 3,
      empresa: 'Global Parts Perú',
      contacto: 'Luis Quispe',
      telefono: '945678901',
      correo: 'luis@globalparts.pe',
      fechaRegistro: '2025-05-01'
    }
  ];

  private nextId = 4;

  getProveedores(): Observable<Proveedor[]> {
    return of([...this.proveedores]);
  }

  agregarProveedor(proveedor: Omit<Proveedor, 'id'>): Observable<Proveedor> {
    const nuevo: Proveedor = { id: this.nextId++, ...proveedor };
    this.proveedores.push(nuevo);
    return of(nuevo);
  }

  actualizarProveedor(id: number, datos: Omit<Proveedor, 'id'>): Observable<Proveedor> {
    const idx = this.proveedores.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Proveedor no encontrado');
    this.proveedores[idx] = { id, ...datos };
    return of(this.proveedores[idx]);
  }

  eliminarProveedor(id: number): Observable<void> {
    this.proveedores = this.proveedores.filter(p => p.id !== id);
    return of(void 0);
  }
}
