import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './shared/components/header/header.component';
import { HeroComponent } from './shared/components/hero/hero.component';
import { BenefitsComponent } from './shared/components/benefits/benefits.component';
import { ContactComponent } from './shared/components/contact/contact.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HomeComponent } from './features/home/pages/home/home.component';
import { AppComponent } from './app.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard.component';
import { VentasModule } from '../features/ventas/ventas.module';
import { RegistroVentaPage } from '../features/ventas/pages/registro/registro-venta.page';
import { ListadoVentasPage } from '../features/ventas/pages/listado/listado-ventas.page';

@NgModule({ 
  declarations: [
    AppComponent,
    HeaderComponent,
    HeroComponent,
    BenefitsComponent,
    ContactComponent,
    FooterComponent,
    // DashboardComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    VentasModule,
    RegistroVentaPage,
    ListadoVentasPage
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }