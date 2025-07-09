import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PaymentFormComponent } from '@pages/payment-form/payment-form.component';
import { CardsLogosComponent } from '@shared/cards-logos/cards-logos.component';
import { PageHeaderComponent } from '@shared/page-header/page-header.component';
import { CurrencyService, CurrencyPipe } from '@core';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [
    CommonModule, 
    PaymentFormComponent, 
    CardsLogosComponent, 
    PageHeaderComponent,
    CurrencyPipe
  ],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss',
})
export class OrderPageComponent implements OnInit {
  orden: any = {
    hotelImage: '',
    hotelName: '',
    Rooms: '',
    Currency: '',
    TotalPrice: '',
    checkIn: '',
    nigths: '',
    RoomsQty: '',
    AdultsQty: '',
    ChildQty: '',
    ChildAges: '',
    HotelSearchCode: '',
    CxlDeadLine: '',
    TourName: 'Isla Saona',
  };

  constructor(
    private route: ActivatedRoute,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.orden.hotelImage = params['hotelImage'];
      this.orden.hotelName = params['hotelName'];
      this.orden.Location = params['Location'];
      this.orden.Rooms = params['Rooms'];
      this.orden.Currency = params['Currency'];
      this.orden.TotalPrice = params['TotalPrice'];
      this.orden.checkIn = params['checkIn'];
      this.orden.nigths = params['nigths'];
      this.orden.RoomsQty = params['RoomsQty'];
      this.orden.AdultsQty = params['AdultsQty'];
      this.orden.ChildQty = params['ChildQty'];
      this.orden.ChildAges = params['ChildAges'];
      this.orden.HotelSearchCode = params['HotelSearchCode'];
      this.orden.CxlDeadLine = params['CxlDeadLine'];
      this.orden.TourName = params['TourName'];
    });
  }
}
