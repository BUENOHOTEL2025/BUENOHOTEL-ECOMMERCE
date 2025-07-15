import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './page-footer.component.html',
  styleUrl: './page-footer.component.scss'
})
export class PageFooterComponent {
  showLogoModal = false;
  modalLogo: 'mastercard' | 'visa' | null = null;

  constructor(public router: Router) {}

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }

  openLogoModal(logo: 'mastercard' | 'visa') {
    this.modalLogo = logo;
    this.showLogoModal = true;
  }

  closeLogoModal() {
    this.showLogoModal = false;
    this.modalLogo = null;
  }
}

