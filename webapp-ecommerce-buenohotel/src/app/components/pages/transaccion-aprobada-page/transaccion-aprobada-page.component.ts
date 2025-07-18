import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface ApiResponse {
  ok: boolean;
  message: string;
  data: {
    totalPrice: string;
    pricePerPerson: number;
    createdAt: string;
    email: string;
    name: string;
    persons: number;
    reservationCode: string;
    hotel: string;
    date: string;
    customerType: string;
    updatedAt: string;
    AzulAprobacion: {
      ErrorDescription: string;
      CardNumber: string;
      AzulOrderId: string;
      Amount: string;
      OrderNumber: string;
      Itbis: string;
      ResponseMessage: string;
      DateTime: string;
    };
    uuid: string;
    tour: string;
  };
}

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

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      Object.keys(this.order).forEach((key) => {
        if (params[key]) {
          this.order[key] = params[key];
        }
      });

      this.updateOrderWithPaymentData();
    });
  }

  updateOrderWithPaymentData(): void {
    const paymentData = {
      uuid: this.order.OrderNumber,
      AzulAprobacion: {
        OrderNumber: this.order.OrderNumber,
        Amount: this.order.Amount,
        Itbis: this.order.Itbis,
        DateTime: this.order.DateTime,
        ResponseMessage: this.order.ResponseMessage,
        ErrorDescription: this.order.ErrorDescription,
        CardNumber: this.order.CardNumber,
        AzulOrderId: this.order.AzulOrderId,
      },
    };

    this.http
      .patch<ApiResponse>(`https://api-tours.buenohotel.com.do/reservations`, paymentData)
      .subscribe({
        next: (response) => {
          console.log('Order updated successfully', response);
          this.redirectToEmailConfirmation(response.data);
        },
        error: (error) => {
          console.error('Error updating order', error);
        },
      });
  }
  redirectToEmailConfirmation(reservationData: any): void {
    // Format the date for display
    const tourDate = new Date(reservationData.date);
    const formattedDate = tourDate
      .toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      .replace(',', '');

    // Create booking data object
    const bookingData = {
      clientName: reservationData.name,
      tourDate: formattedDate,
      pickupLocation: reservationData.hotel,
      pickupTime: '7:00 AM',
      numberOfPeople: reservationData.persons.toString(),
      bookingId: reservationData.reservationCode,
      paymentDate: new Date()
        .toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
        .replace(',', ''),
      paymentMethod: 'Credit Card',
      paymentAmount: reservationData.totalPrice,
      paymentReference: reservationData.AzulAprobacion.AzulOrderId,
      recipientEmail: reservationData.email,
      tourName: reservationData.tour,
    };

    const encodedBookingData = encodeURIComponent(JSON.stringify(bookingData));

    // window.location.href = `http://localhost:62746/email/tour-payment-confirmation?bookingData=${encodedBookingData}`;
    window.location.href = `https://booking.buenohotel.com.do/email/tour-payment-confirmation?bookingData=${encodedBookingData}`;
  }
}
