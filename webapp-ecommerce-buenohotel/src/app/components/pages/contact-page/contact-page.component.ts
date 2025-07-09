import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { PageFooterComponent } from '../../shared/page-footer/page-footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, PageFooterComponent],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss'
})
export class ContactPageComponent {
  constructor(public router: Router) {}

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }
}
