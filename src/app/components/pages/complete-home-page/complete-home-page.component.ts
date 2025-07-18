import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { PageFooterComponent } from '../../shared/page-footer/page-footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardsLogosComponent } from '@shared/cards-logos/cards-logos.component';

@Component({
  selector: 'app-complete-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, CardsLogosComponent, PageFooterComponent],
  templateUrl: './complete-home-page.component.html',
  styleUrls: ['./complete-home-page.component.scss']
})
export class CompleteHomePageComponent {
  constructor(public router: Router) {}

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }
  showReservas: boolean = false;
  reservas: any[] = [
    { nombre: 'Juan Pérez', fecha: '2025-06-20', servicio: 'Hotel' },
    { nombre: 'Ana Gómez', fecha: '2025-07-05', servicio: 'Tour' }
  ];

  toggleReservas() {
    this.showReservas = !this.showReservas;
  }

  eliminarReserva(idx: number) {
    this.reservas.splice(idx, 1);
  }

  scrollToServiciosDestacados() {
    const section = document.getElementById('servicios-destacados');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  countries = [
    { code: 'es', name: 'España', flag: 'https://flagpedia.net/data/flags/w702/es.webp' },
    { code: 'aw', name: 'Aruba', flag: 'https://flagpedia.net/data/flags/w702/aw.webp' },
    { code: 'af', name: 'Afghanistan', flag: 'https://flagpedia.net/data/flags/w702/af.webp' },
    { code: 'ao', name: 'Angola', flag: 'https://flagpedia.net/data/flags/w702/ao.webp' },
    { code: 'ar', name: 'Argentina', flag: 'https://flagpedia.net/data/flags/w702/ar.webp' },
    { code: 'au', name: 'Australia', flag: 'https://flagpedia.net/data/flags/w702/au.webp' },
    { code: 'at', name: 'Austria', flag: 'https://flagpedia.net/data/flags/w702/at.webp' },
    { code: 'br', name: 'Brazil', flag: 'https://flagpedia.net/data/flags/w702/br.webp' },
    { code: 'ca', name: 'Canada', flag: 'https://flagpedia.net/data/flags/w702/ca.webp' },
    { code: 'cl', name: 'Chile', flag: 'https://flagpedia.net/data/flags/w702/cl.webp' },
    { code: 'cn', name: 'China', flag: 'https://flagpedia.net/data/flags/w702/cn.webp' },
    { code: 'co', name: 'Colombia', flag: 'https://flagpedia.net/data/flags/w702/co.webp' }
  ];
  selectedCountry = this.countries[0];
  dropdownOpen = false;

  selectCountry(country: any) {
    this.selectedCountry = country;
    this.dropdownOpen = false;
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
