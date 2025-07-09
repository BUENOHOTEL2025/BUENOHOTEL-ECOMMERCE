import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsLogosComponent } from './cards-logos.component';

describe('CardsLogosComponent', () => {
  let component: CardsLogosComponent;
  let fixture: ComponentFixture<CardsLogosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsLogosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardsLogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
