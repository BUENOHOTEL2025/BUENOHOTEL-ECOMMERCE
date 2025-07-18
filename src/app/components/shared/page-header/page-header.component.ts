import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from '../../../core/services/currency.service';
import { LanguageService } from '../../../core/services/language.service';
import { CurrencyPipe } from '../../../core/pipes/currency.pipe';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive, FormsModule, CurrencyPipe],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent implements OnInit, OnDestroy {
  selectedCurrency: string = 'DOP';
  currentLanguage: string = 'do'; // Código de República Dominicana como predeterminado
  languages: any[] = [];
  private languageChangeListener: any;

  private isBrowser: boolean;

  constructor(
    private currencyService: CurrencyService,
    private languageService: LanguageService,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.languages = this.languageService.languages;
    this.currentLanguage = this.languageService.getCurrentLanguage();
  }

  ngOnInit(): void {
    // Solo en el navegador
    if (this.isBrowser) {
      // Escuchar cambios de idioma
      this.languageChangeListener = (event: Event) => {
        const lang = (event as CustomEvent).detail;
        this.currentLanguage = lang;
      };
      
      window.addEventListener('languageChanged', this.languageChangeListener);
      
      // Cargar la moneda guardada o usar la predeterminada
      if (typeof localStorage !== 'undefined') {
        const savedCurrency = localStorage.getItem('selectedCurrency');
        if (savedCurrency) {
          this.selectedCurrency = savedCurrency;
          this.currencyService.currentCurrency = savedCurrency;
        }
      }
    }
  }

  onCurrencyChange(): void {
    // Guardar la preferencia de moneda
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('selectedCurrency', this.selectedCurrency);
      } catch (error) {
        console.warn('No se pudo guardar la preferencia de moneda:', error);
      }
    }
    this.currencyService.currentCurrency = this.selectedCurrency;
  }

  // Verifica si la ruta actual coincide con la ruta proporcionada
  isActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(`${route}/`);
  }

  onLanguageChange(): void {
    this.languageService.setLanguage(this.currentLanguage);
  }
  
  ngOnDestroy(): void {
    // Limpiar el event listener cuando el componente se destruye
    if (this.isBrowser && this.languageChangeListener) {
      window.removeEventListener('languageChanged', this.languageChangeListener);
    }
  }
}
