import { Component } from '@angular/core';
import { VentasDashboardComponent } from '../ventas-dashboard/ventas-dashboard.component';
import { VentasPanelComponent } from '../ventas-panel/ventas-panel.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [VentasDashboardComponent, VentasPanelComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {}
