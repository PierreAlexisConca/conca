import { Component } from '@angular/core';
import { VentasMemoriaService, Cliente, Producto, VentaProducto } from '../../services/ventas-memoria.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
	selector: 'app-registro-venta',
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule],
	templateUrl: './registro-venta.page.html',
	styleUrls: ['./registro-venta.page.css']
})
export class RegistroVentaPage {
	clientes: Cliente[] = [];
	productos: Producto[] = [];
	ventaForm: FormGroup;
	errorMsg: string = '';
	exitoMsg: string = '';
	constructor(
		private ventasService: VentasMemoriaService,
		private fb: FormBuilder
	) {
		this.ventaForm = this.fb.group({
			cliente: [null, Validators.required],
			productos: this.fb.array([])
		});
		this.cargarDatos();
		this.agregarProducto();
	}
	cargarDatos() {
		this.ventasService.getClientes().subscribe(c => this.clientes = c);
		this.ventasService.getProductos().subscribe(p => this.productos = p);
	}
	get productosForm() {
		return this.ventaForm.get('productos') as FormArray;
	}
	agregarProducto() {
		this.productosForm.push(this.fb.group({
			productoId: [null, Validators.required],
			cantidad: [1, [Validators.required, Validators.min(1)]],
			precio: [{ value: 0, disabled: true }],
			nombre: [''],
			subtotal: [{ value: 0, disabled: true }]
		}));
	}
	eliminarProducto(idx: number) {
		this.productosForm.removeAt(idx);
	}
	actualizarProducto(idx: number) {
		const grupo = this.productosForm.at(idx);
		const productoId = grupo.get('productoId')?.value;
		const producto = this.productos.find(p => p.id == productoId);
		if (producto) {
			grupo.patchValue({
				precio: producto.precio,
				nombre: producto.nombre
			});
			this.actualizarSubtotal(idx);
		}
	}
	actualizarSubtotal(idx: number) {
		const grupo = this.productosForm.at(idx);
		const cantidad = grupo.get('cantidad')?.value;
		const precio = grupo.get('precio')?.value;
		grupo.patchValue({ subtotal: cantidad * precio });
	}
	get total() {
		return this.productosForm.controls.reduce((acc, curr) => acc + (curr.get('subtotal')?.value || 0), 0);
	}
	registrarVenta() {
		this.errorMsg = '';
		this.exitoMsg = '';
		if (this.ventaForm.invalid) {
			this.errorMsg = 'Complete todos los campos obligatorios.';
			return;
		}
		const productos: VentaProducto[] = this.productosForm.controls.map(ctrl => ({
			productoId: ctrl.get('productoId')?.value,
			nombre: ctrl.get('nombre')?.value,
			cantidad: ctrl.get('cantidad')?.value,
			precio: ctrl.get('precio')?.value,
			subtotal: ctrl.get('subtotal')?.value
		}));
		if (productos.length === 0) {
			this.errorMsg = 'Debe agregar al menos un producto.';
			return;
		}
		for (const p of productos) {
			const prod = this.productos.find(pr => pr.id === p.productoId);
			if (!prod || p.cantidad > prod.stock) {
				this.errorMsg = `Stock insuficiente para ${p.nombre}`;
				return;
			}
		}
		this.ventasService.registrarVenta({
			cliente: this.clientes.find(c => c.id === this.ventaForm.value.cliente)!,
			productos,
			total: this.total
		}).subscribe({
			next: () => {
				this.exitoMsg = '¡Venta registrada exitosamente!';
				this.ventaForm.reset();
				this.productosForm.clear();
				this.agregarProducto();
				this.cargarDatos();
			},
			error: err => {
				this.errorMsg = err.message || 'Error al registrar la venta.';
			}
		});
	}
}
