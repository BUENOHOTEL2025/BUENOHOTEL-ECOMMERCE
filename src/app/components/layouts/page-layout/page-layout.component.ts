import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageFooterComponent } from '@shared/page-footer/page-footer.component';
import { PageHeaderComponent } from '@shared/page-header/page-header.component';
import { CompleteHomePageComponent } from '@pages/complete-home-page/complete-home-page.component';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [RouterOutlet, PageHeaderComponent, PageFooterComponent, CompleteHomePageComponent],
  templateUrl: './page-layout.component.html',
  styleUrl: './page-layout.component.scss',
})
export class PageLayoutComponent {}
