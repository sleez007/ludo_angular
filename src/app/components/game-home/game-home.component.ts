import { Component, Input } from '@angular/core';
import { GameColor } from '../../model';

@Component({
  selector: 'app-game-home',
  standalone: true,
  imports: [],
  templateUrl: './game-home.component.html',
  styleUrl: './game-home.component.scss',
})
export class GameHomeComponent {
  @Input({ required: true }) color!: GameColor;
}
