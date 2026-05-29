# Actividad Individual — Formularios Reactivos en Angular

**Alumno:** Flores Pierre  
**Proyecto:** Gestión de Proveedores con Reactive Forms

---

## Parte 1 — Investigación Teórica (1 punto)

### ¿Qué son los Formularios Reactivos en Angular?

Los **Reactive Forms** (formularios reactivos) son una técnica de Angular para manejar formularios de manera programática, desde el componente TypeScript, en lugar de depender del HTML para definir la lógica. Se basan en el módulo `ReactiveFormsModule`.

La idea central es que el estado del formulario vive en el componente como un objeto `FormGroup`, que contiene `FormControl`s (campos individuales) y opcionalmente `FormArray`s (listas dinámicas de controles). Esto permite:

- **Control total desde el código**: las validaciones, valores iniciales y cambios se definen en TypeScript.
- **Inmutabilidad y flujo de datos predecible**: el estado del formulario es un objeto observable.
- **Testabilidad**: al estar en el componente, los formularios son fáciles de probar unitariamente.
- **Escalabilidad**: ideal para formularios complejos con campos dinámicos.

#### Estructura básica

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// En el constructor del componente:
this.miFormulario = this.fb.group({
  nombre: ['', [Validators.required, Validators.minLength(3)]],
  correo: ['', [Validators.required, Validators.email]],
  precio: [0,  [Validators.required, Validators.min(0.01)]]
});
```

En el HTML se enlaza con `[formGroup]` y `formControlName`:

```html
<form [formGroup]="miFormulario" (ngSubmit)="guardar()">
  <input formControlName="nombre" />
  <input formControlName="correo" />
</form>
```

---

### ¿Cómo se manejan las Validaciones Personalizadas?

Angular incluye validadores integrados (`Validators.required`, `Validators.email`, `Validators.min`, etc.), pero muchas veces se necesita lógica de negocio específica. Para eso existen los **validadores personalizados**.

Un validador personalizado es una **función** que recibe un `AbstractControl` y devuelve:
- `null` si el valor es válido.
- Un objeto `{ clave: true }` si el valor es inválido.

#### Patrón de un validador personalizado (como `ValidatorFn`):

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function miValidador(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    // lógica de validación...
    const esValido = /* condición */ true;
    return esValido ? null : { miError: true };
  };
}
```

Se aplica igual que los validadores nativos:

```typescript
this.fb.group({
  campo: ['', [Validators.required, miValidador()]]
});
```

Y en el HTML se muestra el error con:

```html
<span *ngIf="campo?.errors?.['miError']">Mensaje de error personalizado</span>
```

---

### Tres Ejemplos de Validaciones Útiles para Sistemas de Gestión

#### 1. Correos válidos (validación de dominio empresarial)

En sistemas de gestión de proveedores o empleados, no basta con verificar que el correo tenga formato válido. También conviene rechazar dominios temporales o desechables como `mailinator.com` o `tempmail.com`, que no corresponden a correos empresariales reales.

```typescript
export function correoEmpresarialValidator(): ValidatorFn {
  const dominiosProhibidos = ['mailinator.com', 'tempmail.com', 'yopmail.com'];
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = (control.value ?? '').toLowerCase();
    const esValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    if (!esValido) return { correoInvalido: true };
    const dominio = valor.split('@')[1];
    if (dominiosProhibidos.includes(dominio)) return { dominioProhibido: true };
    return null;
  };
}
```

**Uso práctico:** Registro de proveedores, empleados, clientes corporativos.

---

#### 2. Precios mayores a 0 (validación de valor numérico positivo)

En sistemas de inventario o ventas, un precio de 0 o negativo no tiene sentido de negocio. Angular tiene `Validators.min(0.01)`, pero se puede crear un validador personalizado para mensajes más descriptivos o lógica adicional (por ejemplo, precio máximo permitido).

```typescript
export function precioPositivoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = parseFloat(control.value);
    if (isNaN(valor) || valor <= 0) return { precioInvalido: true };
    if (valor > 999999) return { precioExcesivo: true };
    return null;
  };
}
```

**Uso práctico:** Registro de productos, cotizaciones, órdenes de compra.

---

#### 3. Fechas coherentes (fecha no anterior a hoy)

En sistemas de reservas, contratos o registros de proveedores, una fecha de inicio o registro no debería poder ser anterior a la fecha actual. Esto evita datos inconsistentes en la base de datos.

```typescript
export function fechaNoAnteriorHoyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaIngresada = new Date(control.value + 'T00:00:00');
    return fechaIngresada >= hoy ? null : { fechaAnterior: true };
  };
}
```

**Uso práctico:** Registro de contratos, citas médicas, reservas de servicios, fechas de ingreso de empleados.

---

## Parte 2 — Aplicación Práctica (1 punto)

### Tema elegido: Gestión de Proveedores

Se implementó un formulario reactivo completo para registrar, editar y eliminar proveedores. Los datos se almacenan **en memoria** usando un servicio Angular (`ProveedoresMemoriaService`).

#### Campos del formulario

| Campo | Tipo | Validaciones |
|---|---|---|
| Empresa | Texto | Requerido, mínimo 3 caracteres |
| Contacto | Texto | Requerido, mínimo 3 caracteres |
| Teléfono | Texto | Requerido + **validación personalizada**: exactamente 9 dígitos |
| Correo | Email | Requerido + **validación personalizada**: formato válido y sin dominios temporales |
| Fecha de Registro | Fecha | Requerido + **validación personalizada**: no anterior a la fecha actual |

#### Validaciones personalizadas aplicadas

1. **`telefonoNueveDígitosValidator()`** — verifica que el teléfono tenga exactamente 9 dígitos numéricos (estándar peruano).
2. **`correoEmpresarialValidator()`** — valida formato de correo y rechaza dominios temporales.
3. **`fechaNoAnteriorHoyValidator()`** — impide registrar fechas pasadas.

#### Funcionalidades implementadas

- Registrar nuevo proveedor
- Editar proveedor existente (carga datos en el formulario)
- Eliminar proveedor con confirmación
- Listado en tabla con todos los proveedores
- Mensajes de éxito y error
- Datos iniciales de ejemplo cargados en memoria

#### Ruta de acceso

```
http://localhost:4200/proveedores
```

#### Archivos creados

```
src/app/features/proveedores/
├── services/
│   └── proveedores-memoria.service.ts   ← Servicio con datos en memoria
├── validators/
│   └── proveedores.validators.ts        ← 3 validaciones personalizadas
└── pages/
    └── proveedores/
        ├── proveedores.component.ts     ← Lógica del componente
        ├── proveedores.component.html   ← Template con formulario reactivo
        └── proveedores.component.css    ← Estilos
```
