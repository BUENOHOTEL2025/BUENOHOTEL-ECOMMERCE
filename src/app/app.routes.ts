import { Routes } from '@angular/router';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { CompleteHomePageComponent } from '@pages/complete-home-page/complete-home-page.component';
import { PolicyPageComponent } from '@pages/policy-page/policy-page.component';
import { ContactPageComponent } from '@pages/contact-page/contact-page.component';
import { OrderPageComponent } from '@pages/order-page/order-page.component';
import { TransaccionAprobadaPageComponent } from '@pages/transaccion-aprobada-page/transaccion-aprobada-page.component';
import { TransaccionDeclinadaPageComponent } from '@pages/transaccion-declinada-page/transaccion-declinada-page.component';
import { TransaccionCanceladaPageComponent } from '@pages/transaccion-cancelada-page/transaccion-cancelada-page.component';

export const routes: Routes = [
  {
    path: '',
    component: PageLayoutComponent,
    children: [
      // { path: '', component: HomePageComponent },
      { path: '', component: CompleteHomePageComponent },
      { path: 'politicas', component: PolicyPageComponent },
      { path: 'contactos', component: ContactPageComponent },
      { path: 'orden', component: OrderPageComponent },
      { path: 'aprobada', component: TransaccionAprobadaPageComponent },
      { path: 'declinada', component: TransaccionDeclinadaPageComponent },
      { path: 'cancelada', component: TransaccionCanceladaPageComponent },
    ],
  },
];
