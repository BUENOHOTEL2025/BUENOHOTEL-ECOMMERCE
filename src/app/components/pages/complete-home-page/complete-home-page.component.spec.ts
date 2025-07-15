import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteHomePageComponent } from './complete-home-page.component';

describe('CompleteHomePageComponent', () => {
  let component: CompleteHomePageComponent;
  let fixture: ComponentFixture<CompleteHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteHomePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompleteHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
