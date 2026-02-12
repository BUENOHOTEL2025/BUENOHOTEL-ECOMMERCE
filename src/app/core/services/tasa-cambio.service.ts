import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasaCambioService {
  private apiUrl =
    'https://h0q597no4j.execute-api.us-east-1.amazonaws.com/admin/eventos/tasa-cambio';

  constructor(private http: HttpClient) {}

  getTasaUsdToDop(): Observable<number> {
    return this.http
      .get<any>(this.apiUrl)
      .pipe(map((response) => response.data.tasaCambio));
  }
}
