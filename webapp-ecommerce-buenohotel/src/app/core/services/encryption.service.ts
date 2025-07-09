import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  constructor() {}

  generateAuthHash(data: string, privateKey: string): string {
    return CryptoJS.HmacSHA512(data, privateKey).toString(CryptoJS.enc.Hex);
  }
}
