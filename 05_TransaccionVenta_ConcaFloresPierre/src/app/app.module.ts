import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Shared
import { HeaderComponent } from './shared/components/header/header.component';
import { HeroComponent } from './shared/components/hero/hero.component';
import { BenefitsComponent } from './shared/components/benefits/benefits.component';
import { ContactComponent } from './shared/components/contact/contact.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CoursesComponent } from './shared/components/courses/courses.component';

// Features
import { HomeComponent } from './features/home/pages/home/home.component';
import { AppComponent } from './app.component';

// Standalone imports
import { ProveedoresComponent } from './features/proveedores/pages/proveedores/proveedores.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeroComponent,
    BenefitsComponent,
    ContactComponent,
    FooterComponent,
    CoursesComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    ProveedoresComponent,
    DashboardComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
