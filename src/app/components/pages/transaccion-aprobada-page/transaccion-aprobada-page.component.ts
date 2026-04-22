import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// --- Interface for Tour API Response (Unchanged) ---
interface TourApiResponse {
  ok: boolean;
  message: string;
  data: {
    totalPrice: string;
    name: string;
    email: string;
    persons: number;
    reservationCode: string;
    hotel: string;
    date: string;
    AzulAprobacion: { AzulOrderId: string; Amount: string };
    tour: string;
  };
}

// --- CORRECTED Interface for Booking API Response ---
interface BookingApiResponse {
  ok: boolean;
  message: string;
  data: {
    uuid: string;
    hotel: string; // Correct field name
    email: string; // Correct location
    arrivalDate: string;
    nights: number;
    leader: {
      LeaderPersonID: string; // Correct structure
    };
    rooms: {
      Rooms: {
        Persons: {
          PersonID: string;
          FirstName: string;
          LastName: string;
          Title: string;
        }[];
      }[];
    }[];
    AzulAprobacion: {
      AzulOrderId: string;
      Amount: string;
    };
    bookingCode: string;
    bookingReference: string;
  };
}

@Component({
  selector: 'app-transaccion-aprobada-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaccion-aprobada-page.component.html',
  styleUrl: './transaccion-aprobada-page.component.scss',
})
export class TransaccionAprobadaPageComponent implements OnInit {
  order: any = {};

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.order = { ...params };

      if (params['tourName']) {
        this.updateTourOrderWithPaymentData();
      } else {
        this.updateBookingOrderWithPaymentData();
      }
    });
  }

  // ==================================================================
  // LOGIC FOR HOTEL BOOKINGS
  // ==================================================================

  updateBookingOrderWithPaymentData(): void {
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
      .patch<BookingApiResponse>(
        `https://api-booking.buenohotel.com.do/reservations`,
        paymentData,
      )
      .subscribe({
        next: (response) => {
          console.log('Booking order updated successfully', response);
          if (response.ok && response.data) {
            this.redirectToBookingEmailConfirmation(response.data);
          }
        },
        error: (error) => {
          console.error('Error updating booking order', error);
        },
      });
  }

  redirectToBookingEmailConfirmation(
    reservationData: BookingApiResponse['data'],
  ): void {
    const checkInDate = new Date(reservationData.arrivalDate);
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + reservationData.nights);

    const formatDate = (date: Date) => {
      return date
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
        })
        .replace(/ /g, '/');
    };

    const allPersons = (reservationData.rooms || [])
      .flatMap((room) => room.Rooms || [])
      .flatMap((innerRoom) => innerRoom.Persons || [])
      .filter((person) => person);

    const guestsList = allPersons
      .map((person) => `${person.FirstName} ${person.LastName} ${person.Title}`)
      .join(', ');

    const leaderInfo = allPersons.find(
      (p) => p.PersonID === reservationData.leader.LeaderPersonID,
    );
    const clientName = leaderInfo
      ? `${leaderInfo.FirstName} ${leaderInfo.LastName}`.trim()
      : 'Valued Customer';

    const recipientEmail = reservationData.email;

    if (!recipientEmail) {
      console.error(
        'Cannot send email confirmation: Recipient email not found in API response.',
      );
      return;
    }

    const bookingDataForEmail = {
      clientName: clientName,
      hotelName: reservationData.hotel, // Use correct field 'hotel'
      bookingId: reservationData.bookingCode,
      bookingReference: reservationData.bookingReference,
      checkIn: formatDate(checkInDate),
      checkOut: formatDate(checkOutDate),
      guests: guestsList,
      paymentDate: new Date()
        .toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
        .replace(',', ''),
      paymentMethod: 'Credit Card',
      paymentAmount: reservationData.AzulAprobacion.Amount,
      paymentReference: reservationData.AzulAprobacion.AzulOrderId,
      recipientEmail: recipientEmail,
    };

    const encodedBookingData = encodeURIComponent(
      JSON.stringify(bookingDataForEmail),
    );

    window.location.href = `https://develop-booking.buenohotel.com.do/email/voucher-details?bookingData=${encodedBookingData}`;
  }

  // ==================================================================
  // LOGIC FOR TOURS (Unchanged)
  // ==================================================================

  updateTourOrderWithPaymentData(): void {
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
      .patch<TourApiResponse>(
        `https://api-tours.buenohotel.com.do/reservations`,
        paymentData,
      )
      .subscribe({
        next: (response) => {
          console.log('Tour order updated successfully', response);
          if (response.ok) {
            this.redirectToTourEmailConfirmation(response.data);
          }
        },
        error: (error) => {
          console.error('Error updating tour order', error);
        },
      });
  }

  redirectToTourEmailConfirmation(
    reservationData: TourApiResponse['data'],
  ): void {
    const tourDate = new Date(reservationData.date);
    const formattedDate = tourDate
      .toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      .replace(',', '');

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
      paymentAmount: reservationData.AzulAprobacion.Amount,
      paymentReference: reservationData.AzulAprobacion.AzulOrderId,
      recipientEmail: reservationData.email,
      tourName: reservationData.tour,
    };

    const encodedBookingData = encodeURIComponent(JSON.stringify(bookingData));
    window.location.href = `https://develop-booking.buenohotel.com.do/email/tour-payment-confirmation?bookingData=${encodedBookingData}`;
  }

  formatMonto(valor: string | number): number {
    console.log('valor', valor);
    if (!valor) return 0;
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;

    if (isNaN(numero)) return 0;

    return numero / 100;
  }

  formatFecha(fechaStr: string): string {
    // Verifica que la fecha exista y tenga el largo correcto (14 caracteres)
    if (!fechaStr || fechaStr.length !== 14) {
      return fechaStr; // Si no tiene el formato esperado, la devuelve tal cual
    }

    const year = fechaStr.substring(0, 4);
    const month = fechaStr.substring(4, 6);
    const day = fechaStr.substring(6, 8);
    let hour = parseInt(fechaStr.substring(8, 10), 10);
    const minute = fechaStr.substring(10, 12);
    const second = fechaStr.substring(12, 14);

    // Opcional: Convertir a formato 12 horas (AM/PM)
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // Si la hora es 0, la convierte en 12
    const hourFormatted = hour < 10 ? '0' + hour : hour;

    // Retorna: DD/MM/YYYY HH:MM:SS AM/PM
    return `${day}/${month}/${year} ${hourFormatted}:${minute} ${ampm}`;
  }
}
