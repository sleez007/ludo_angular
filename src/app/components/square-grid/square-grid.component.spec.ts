import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareGridComponent } from './square-grid.component';

describe('SquareGridComponent', () => {
  let component: SquareGridComponent;
  let fixture: ComponentFixture<SquareGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SquareGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SquareGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
