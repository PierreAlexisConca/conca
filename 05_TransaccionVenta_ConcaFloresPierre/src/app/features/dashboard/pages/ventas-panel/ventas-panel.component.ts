import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-ventas-panel',
  templateUrl: './ventas-panel.component.html',
  styleUrls: ['./ventas-panel.component.css']
})
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-ventas-panel',
  standalone: true,
  imports: [CommonModule],
  providers: [CurrencyPipe],
  templateUrl: './ventas-panel.component.html',
  styleUrls: ['./ventas-panel.component.css']
})
export class VentasPanelComponent {
  ventas: any[] = [];

  constructor(private storage: StorageService, private currencyPipe: CurrencyPipe) {}

  ngOnInit() {
    this.ventas = this.storage.getVentas();
  }

  getTotalVenta(venta: any): string {
    if (!venta.productos) return this.currencyPipe.transform(0, 'USD', 'symbol', '1.2-2') || '';
    const total = venta.productos.reduce((acc: number, p: any) => acc + (p.cantidad * p.precio), 0);
    return this.currencyPipe.transform(total, 'USD', 'symbol', '1.2-2') || '';
  }
}
