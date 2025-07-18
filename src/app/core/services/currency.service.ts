import { Injectable, PLATFORM_ID, Inject, EventEmitter } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

// Tasa de cambio (1 USD = X DOP)
// En una aplicación real, esto podría venir de una API
const EXCHANGE_RATE = 56.5; // Ejemplo: 1 USD = 56.5 DOP

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly isBrowser: boolean;
  private readonly storageKey = 'preferredCurrency';
  private _currentCurrency = 'DOP';
  private currencyChanged = new EventEmitter<string>();
  
  // Inicializar el BehaviorSubject con el valor por defecto
  private currencySubject = new BehaviorSubject<string>('DOP');
  
  // Tasa de cambio (1 USD = X DOP)
  private readonly exchangeRate = 56.5; // Ejemplo: 1 USD = 56.5 DOP

  // Observable que los componentes pueden suscribirse
  currency$ = this.currencySubject.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Cargar la moneda guardada
    this.loadCurrency();
  }

  get currentCurrency(): string {
    return this._currentCurrency;
  }

  set currentCurrency(currency: string) {
    if (this._currentCurrency !== currency && (currency === 'USD' || currency === 'DOP')) {
      this._currentCurrency = currency;
      this.currencySubject.next(currency);
      this.currencyChanged.emit(currency);
      
      if (this.isBrowser) {
        this.saveCurrency();
      }
    }
  }

  // Convierte un monto a la moneda actual
  convert(amount: number, fromCurrency: string = 'USD'): number {
    if (this._currentCurrency === fromCurrency) {
      return amount;
    }

    if (this._currentCurrency === 'DOP' && fromCurrency === 'USD') {
      return amount * EXCHANGE_RATE;
    }

    if (this._currentCurrency === 'USD' && fromCurrency === 'DOP') {
      return amount / EXCHANGE_RATE;
    }

    return amount;
  }

  // Formatea un monto según la moneda actual
  format(amount: number, currencyCode: string = this._currentCurrency): string {
    const value = this.convert(amount, currencyCode);
    const formatter = new Intl.NumberFormat(
      this._currentCurrency === 'USD' ? 'en-US' : 'es-DO', 
      {
        style: 'currency',
        currency: this._currentCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );
    return formatter.format(value);
  }

  // Obtiene el símbolo de moneda actual
  getCurrencySymbol(): string {
    return this._currentCurrency === 'USD' ? 'US$' : 'RD$';
  }

  private loadCurrency(): void {
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      try {
        const savedCurrency = localStorage.getItem(this.storageKey);
        if (savedCurrency === 'USD' || savedCurrency === 'DOP') {
          this._currentCurrency = savedCurrency;
          this.currencySubject.next(savedCurrency);
        }
      } catch (error) {
        console.warn('Error al cargar la moneda desde localStorage:', error);
      }
    }
  }

  private saveCurrency(): void {
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, this._currentCurrency);
      } catch (error) {
        console.warn('Error al guardar la moneda en localStorage:', error);
      }
    }
  }
}
