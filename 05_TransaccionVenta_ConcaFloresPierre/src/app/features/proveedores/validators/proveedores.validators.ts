import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validación personalizada #0:
 * El texto solo puede contener letras y espacios.
 */
export function soloLetrasValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor: string = (control.value ?? '').trim();
    if (!valor) return null;

    const soloLetras = /^(?=.*\p{L})[\p{L}\s]+$/u.test(valor);
    return soloLetras ? null : { soloLetras: true };
  };
}

/**
 * Validación personalizada #1:
 * El teléfono debe tener exactamente 9 dígitos numéricos.
 */
export function telefonoNueveDígitosValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor: string = control.value ?? '';
    const soloDigitos = /^\d{5}$/.test(valor);
    return soloDigitos ? null : { telefonoInvalido: true };
  };
}

/**
 * Validación personalizada #2:
 * El correo debe pertenecer a un dominio válido (no dominios temporales).
 * Ejemplo: no se aceptan dominios como "mailinator.com" o "tempmail.com".
 */
export function correoEmpresarialValidator(): ValidatorFn {
  const dominiosProhibidos = ['mailinator.com', 'tempmail.com', 'guerrillamail.com', 'yopmail.com'];
  return (control: AbstractControl): ValidationErrors | null => {
    const valor: string = (control.value ?? '').toLowerCase();
    const esCorreoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    if (!esCorreoValido) return { correoInvalido: true };
    const dominio = valor.split('@')[1];
    if (dominiosProhibidos.includes(dominio)) return { dominioProhibido: true };
    return null;
  };
}

/**
 * Validación personalizada #3:
 * La fecha de registro no puede ser anterior a la fecha actual.
 */
export function fechaNoAnteriorHoyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaIngresada = new Date(control.value + 'T00:00:00');
    return fechaIngresada >= hoy ? null : { fechaAnterior: true };
  };
}
