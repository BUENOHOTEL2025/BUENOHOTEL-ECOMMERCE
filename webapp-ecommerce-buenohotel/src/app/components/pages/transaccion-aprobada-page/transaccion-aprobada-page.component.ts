import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaccion-aprobada-page',
  standalone: true,
  imports: [],
  templateUrl: './transaccion-aprobada-page.component.html',
  styleUrl: './transaccion-aprobada-page.component.scss',
})
export class TransaccionAprobadaPageComponent implements OnInit {
  order: any = {
    OrderNumber: '',
    Amount: '',
    Itbis: '',
    AuthorizationCode: '',
    DateTime: '',
    ResponseCode: '',
    IsoCode: '',
    ResponseMessage: '',
    ErrorDescription: '',
    RRN: '',
    AuthHash: '',
    CustomOrderId: '',
    CardNumber: '',
    DataVaultToken: '',
    DataVaultExpiration: '',
    DataVaultBrand: '',
    AzulOrderId: '',
    DCCOffered: '',
    DCCApplied: '',
    DCCCurrency: '',
    DCCCurrencyAlpha: '',
    DCCExchangeRate: '',
    DCCMarkup: '',
    DCCAmount: '',
    Discounted: '',
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.order.OrderNumber = params['OrderNumber'];
      this.order.Amount = params['Amount'];
      this.order.Itbis = params['Itbis'];
      this.order.AuthorizationCode = params['AuthorizationCode'];
      this.order.DateTime = params['DateTime'];
      this.order.ResponseCode = params['ResponseCode'];
      this.order.IsoCode = params['IsoCode'];
      this.order.ResponseMessage = params['ResponseMessage'];
      this.order.ErrorDescription = params['ErrorDescription'];
      this.order.RRN = params['RRN'];
      this.order.AuthHash = params['AuthHash'];
      this.order.CustomOrderId = params['CustomOrderId'];
      this.order.CardNumber = params['CardNumber'];
      this.order.DataVaultToken = params['DataVaultToken'];
      this.order.DataVaultExpiration = params['DataVaultExpiration'];
      this.order.DataVaultBrand = params['DataVaultBrand'];
      this.order.AzulOrderId = params['AzulOrderId'];
      this.order.DCCOffered = params['DCCOffered'];
      this.order.DCCApplied = params['DCCApplied'];
      this.order.DCCCurrency = params['DCCCurrency'];
      this.order.DCCCurrencyAlpha = params['DCCCurrencyAlpha'];
      this.order.DCCExchangeRate = params['DCCExchangeRate'];
      this.order.DCCMarkup = params['DCCMarkup'];
      this.order.DCCAmount = params['DCCAmount'];
      this.order.Discounted = params['Discounted'];
    });
  }
}
