import { Component, HostListener, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardsLogosComponent } from '@shared/cards-logos/cards-logos.component';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { PageFooterComponent } from '../../shared/page-footer/page-footer.component';

@Component({
  selector: 'app-policy-page',
  standalone: true,
  imports: [CommonModule, RouterModule, CardsLogosComponent, PageHeaderComponent, PageFooterComponent],
  templateUrl: './policy-page.component.html',
  styleUrl: './policy-page.component.scss'
})
export class PolicyPageComponent implements OnInit {
  public showLogoModal = false;
  public modalLogo: 'mastercard' | 'visa' | null = null;
  public activeSection: string = 'privacy-policy';
  private sections: HTMLElement[] = [];
  private isBrowser: boolean;

  constructor(
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Inicializar las secciones después de que la vista se haya renderizado
      setTimeout(() => {
        this.sections = Array.from(document.querySelectorAll('.policy-section'));
        this.handleScroll();
      }, 100);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (this.isBrowser) {
      this.handleScroll();
    }
  }

  private handleScroll() {
    const scrollPosition = window.scrollY + 120; // Ajuste para el header fijo
    
    for (const section of this.sections) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        this.activeSection = section.id;
        break;
      }
    }
  }

  scrollToSection(sectionId: string, event: Event) {
    event.preventDefault();
    if (!this.isBrowser) return;
    
    this.activeSection = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100; // Ajusta según la altura de tu header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  scrollToTop() {
    if (this.isBrowser) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }

  public openLogoModal(nombre: 'mastercard' | 'visa') {
    this.showLogoModal = true;
    this.modalLogo = nombre;
  }

  public closeLogoModal() {
    this.showLogoModal = false;
    this.modalLogo = null;
  }
}

