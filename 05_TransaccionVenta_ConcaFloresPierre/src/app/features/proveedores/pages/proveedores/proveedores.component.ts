import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ProveedoresMemoriaService,
  Proveedor
} from '../../services/proveedores-memoria.service';
import {
  soloLetrasValidator,
  telefonoNueveDígitosValidator,
  correoEmpresarialValidator
} from '../../validators/proveedores.validators';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

  proveedores: Proveedor[] = [];
  proveedorForm: FormGroup;
  editando = false;
  idEditando: number | null = null;
  mensajeExito = '';
  mensajeError = '';

  constructor(
    private fb: FormBuilder,
    private proveedoresService: ProveedoresMemoriaService
  ) {
    this.proveedorForm = this.fb.group({
      empresa:  ['', [Validators.required, Validators.minLength(3), soloLetrasValidator()]],
      contacto: ['', [Validators.required, Validators.minLength(3), soloLetrasValidator()]],
      telefono: ['', [Validators.required, telefonoNueveDígitosValidator()]],
      correo:   ['', [Validators.required, correoEmpresarialValidator(), this.correoUnicoValidator()]]
    });
  }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.proveedoresService.getProveedores().subscribe(data => {
      this.proveedores = data;
      this.correo?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private correoUnicoValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const correo = (control.value ?? '').trim().toLowerCase();
      if (!correo) return null;

      const correoDuplicado = this.proveedores.some(proveedor =>
        proveedor.correo.toLowerCase() === correo && proveedor.id !== this.idEditando
      );

      return correoDuplicado ? { correoDuplicado: true } : null;
    };
  }

  guardar(): void {
    this.mensajeExito = '';
    this.mensajeError = '';

    if (this.proveedorForm.invalid) {
      this.proveedorForm.markAllAsTouched();
      this.mensajeError = 'Por favor, corrija los errores del formulario.';
      return;
    }

    const datos = {
      ...this.proveedorForm.value,
      fechaRegistro: new Date().toISOString().split('T')[0]
    };

    if (this.editando && this.idEditando !== null) {
      this.proveedoresService.actualizarProveedor(this.idEditando, datos).subscribe(() => {
        this.mensajeExito = '✅ Proveedor actualizado correctamente.';
        this.resetFormulario();
        this.cargarProveedores();
      });
    } else {
      this.proveedoresService.agregarProveedor(datos).subscribe(() => {
        this.mensajeExito = '✅ Proveedor registrado correctamente.';
        this.resetFormulario();
        this.cargarProveedores();
      });
    }
  }

  editar(proveedor: Proveedor): void {
    this.editando = true;
    this.idEditando = proveedor.id;
    this.mensajeExito = '';
    this.mensajeError = '';
    this.proveedorForm.patchValue({
      empresa:  proveedor.empresa,
      contacto: proveedor.contacto,
      telefono: proveedor.telefono,
      correo:   proveedor.correo
    });
    this.correo?.updateValueAndValidity({ emitEvent: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(id: number): void {
    if (!confirm('¿Está seguro de eliminar este proveedor?')) return;
    this.proveedoresService.eliminarProveedor(id).subscribe(() => {
      this.mensajeExito = '🗑️ Proveedor eliminado.';
      this.cargarProveedores();
    });
  }

  cancelar(): void {
    this.resetFormulario();
  }

  resetFormulario(): void {
    this.proveedorForm.reset();
    this.editando = false;
    this.idEditando = null;
    this.correo?.updateValueAndValidity({ emitEvent: false });
  }

  // Getters para el template
  get empresa()  { return this.proveedorForm.get('empresa'); }
  get contacto() { return this.proveedorForm.get('contacto'); }
  get telefono() { return this.proveedorForm.get('telefono'); }
  get correo()   { return this.proveedorForm.get('correo'); }
}
