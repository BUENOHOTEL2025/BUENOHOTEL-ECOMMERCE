import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
  pure: false // Necesario para que se actualice cuando cambia la moneda
})
export class CurrencyPipe implements PipeTransform {
  constructor(
    private currencyService: CurrencyService,
    private translate: TranslateService
  ) {}

  transform(amount: number, currencyCode: string = 'USD'): string {
    // Si el monto no es un número, devolver vacío
    if (isNaN(amount)) return '';
    
    // Si no hay monto, devolver 0 con la moneda
    if (amount === 0) return this.currencyService.format(0, currencyCode);
    
    // Formatear el monto según la moneda seleccionada
    return this.currencyService.format(amount, currencyCode);
  }
}
