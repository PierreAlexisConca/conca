  eliminarVenta(index: number) {
    this.ventas.splice(index, 1);
    this.storage.saveVentas(this.ventas);
  }

  getTotalVenta(venta: any): number {
    return Array.isArray(venta.productos)
      ? venta.productos.reduce((acc: number, p: any) => acc + (p.cantidad * p.precio), 0)
      : 0;
  }
// ...existing code...
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent {
  paso = 1;
  ventaForm: FormGroup;
  ventas: any[] = [];
  ventaSeleccionada: any = null;
  editando = false;
  indiceEditando: number | null = null;

  constructor(private fb: FormBuilder, private storage: StorageService) {
    this.ventaForm = this.fb.group({
      cliente: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', [Validators.required]],
      productos: this.fb.array([])
    });
    this.ventas = this.storage.getVentas();
  }

  get productos(): FormArray {
    return this.ventaForm.get('productos') as FormArray;
  }

  agregarProducto() {
    this.productos.push(this.fb.group({
      videojuego: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0.01)]]
    }));
  }

  eliminarProducto(index: number) {
    this.productos.removeAt(index);
  }

  getTotal(): number {
    return this.productos.controls.reduce((acc, curr) => {
      const p = curr.value;
      return acc + (p.cantidad * p.precio);
    }, 0);
  }

  guardarVenta() {
    if (this.editando) {
      this.ventas[this.indiceEditando!] = this.ventaForm.value;
      this.editando = false;
      this.indiceEditando = null;
    } else {
      this.ventas.push(this.ventaForm.value);
    }
    this.storage.saveVentas(this.ventas);
    this.ventaForm.reset();
    this.productos.clear();
    this.paso = 1;
  }

  editarVenta(venta: any, index: number) {
    this.ventaForm.patchValue({
      cliente: venta.cliente,
      fecha: venta.fecha
    });
    this.productos.clear();
    venta.productos.forEach((p: any) => {
      this.productos.push(this.fb.group({
        videojuego: p.videojuego,
        cantidad: p.cantidad,
        precio: p.precio
      }));
    });
    this.editando = true;
    this.indiceEditando = index;
    this.paso = 1;
  }

  eliminarVenta(index: number) {
    this.ventas.splice(index, 1);
    this.storage.saveVentas(this.ventas);
  }

  getTotalVenta(venta: any): number {
    return Array.isArray(venta.productos)
      ? venta.productos.reduce((acc: number, p: any) => acc + (p.cantidad * p.precio), 0)
      : 0;
  }
}
