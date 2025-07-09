import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaccionDeclinadaPageComponent } from './transaccion-declinada-page.component';

describe('TransaccionDeclinadaPageComponent', () => {
  let component: TransaccionDeclinadaPageComponent;
  let fixture: ComponentFixture<TransaccionDeclinadaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransaccionDeclinadaPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransaccionDeclinadaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
