import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Orden } from '@interfaces/orden';
import { CommonModule } from '@angular/common';
import { EncryptionService } from '@services/encryption.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss',
})
export class PaymentFormComponent implements OnInit {
  @Input() orden!: any;
  termsAccepted: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['orden']) {
      console.log('orden has changed:', this.orden);
      // Perform any additional logic here
    }
  }

  privateKey =
    'asdhakjshdkjasdasmndajksdkjaskldga8odya9d8yoasyd98asdyaisdhoaisyd0a8sydoashd8oasydoiahdpiashd09ayusidhaos8dy0a8dya08syd0a8ssdsax';
  authHash: string | undefined;

  MerchantId = '39038540035'
  MerchantName = 'Buenohotel'
  MerchantType = 'ECommerce'
  CurrencyCode = '$'
  OrderNumber = '1234'
  Amount = '15000'
  ITBIS = '2057'
  ApprovedUrl = 'https://ecommerce.buenohotel.com.do/aprobada/'
  DeclinedUrl = 'https://ecommerce.buenohotel.com.do/declinada/'
  CancelUrl = 'https://ecommerce.buenohotel.com.do/cancelada/'
  UseCustomField1 = '0'
  CustomField1Label = 'CustomField1Label'
  CustomField1Value = 'CustomField1Value'
  UseCustomField2 = '0'
  CustomField2Label = 'CustomField2Label'
  CustomField2Value = 'CustomField2Value'
  
  submit = 'Realizar Pago'

  constructor(private encryptionService: EncryptionService) {}

  ngOnInit(): void {

    this.Amount = this.getFormattedPrice(this.orden.TotalPrice)

    const data =
      `${this.MerchantId}${this.MerchantName}${this.MerchantType}${this.CurrencyCode}${this.OrderNumber}${this.Amount}${this.ITBIS}${this.ApprovedUrl}${this.DeclinedUrl}${this.CancelUrl}${this.UseCustomField1}${this.CustomField1Label}${this.CustomField1Value}${this.UseCustomField2}${this.CustomField2Label}${this.CustomField2Value}${this.privateKey}`;
      this.authHash = this.encryptionService.generateAuthHash(
      data,
      this.privateKey
    );
  }

  getFormattedPrice(price: number): string {
    return Math.round(price * 100 * 61).toString();
  }

  onSubmit() {
    if (this.termsAccepted) {
      const form = document.getElementById('paymentForm') as HTMLFormElement;
      if (form) {
        form.submit();
      }
    }
  }
}
