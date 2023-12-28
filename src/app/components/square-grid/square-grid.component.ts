import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SquareComponent } from '../square/square.component';
import { GameColor } from '../../model';

@Component({
  selector: 'app-square-grid',
  standalone: true,
  imports: [CommonModule, SquareComponent],
  templateUrl: './square-grid.component.html',
  styleUrl: './square-grid.component.scss',
})
export class SquareGridComponent {
  @Input({ required: true }) isVertical!: boolean;
  @Input({ required: true }) color!: GameColor;

  readonly row1Data = [0, 1, 2, 3, 4, 5];
  readonly row2Data = [6, 0, 1, 2, 3, 4];
  readonly row3Data = [7, 8, 9, 10, 11, 12];
}
