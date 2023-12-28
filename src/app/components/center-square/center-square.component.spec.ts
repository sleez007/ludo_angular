import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterSquareComponent } from './center-square.component';

describe('CenterSquareComponent', () => {
  let component: CenterSquareComponent;
  let fixture: ComponentFixture<CenterSquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterSquareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CenterSquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
