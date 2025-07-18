import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaccionCanceladaPageComponent } from './transaccion-cancelada-page.component';

describe('TransaccionCanceladaPageComponent', () => {
  let component: TransaccionCanceladaPageComponent;
  let fixture: ComponentFixture<TransaccionCanceladaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransaccionCanceladaPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransaccionCanceladaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
