import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaccionAprobadaPageComponent } from './transaccion-aprobada-page.component';

describe('TransaccionAprobadaPageComponent', () => {
  let component: TransaccionAprobadaPageComponent;
  let fixture: ComponentFixture<TransaccionAprobadaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransaccionAprobadaPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransaccionAprobadaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
