import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export type FooterLogoType = 'mastercard-id' | 'visa-id' | 'mastercard-classic' | 'visa-classic';

@Component({
  selector: 'app-page-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './page-footer.component.html',
  styleUrl: './page-footer.component.scss'
})
export class PageFooterComponent {
  showLogoModal = false;
  modalLogo: FooterLogoType | null = null;

  constructor(public router: Router) {}

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }

  openLogoModal(logo: FooterLogoType) {
    this.modalLogo = logo;
    this.showLogoModal = true;
  }

  closeLogoModal() {
    this.showLogoModal = false;
    this.modalLogo = null;
  }
}
