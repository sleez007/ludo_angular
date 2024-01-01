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
  @Input({ required: true }) matrix!: Array<number[]>;
  @Input({ required: true }) cssColor!: string;
  @Input({ required: true }) idPrefix!: string;
}
