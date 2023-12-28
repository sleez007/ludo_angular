import { Component } from '@angular/core';
import { GameHomeComponent } from '../../components/game-home/game-home.component';
import { SquareGridComponent } from '../../components/square-grid/square-grid.component';
import { CenterSquareComponent } from '../../components/center-square/center-square.component';
import { GameColor } from '../../model';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [GameHomeComponent, SquareGridComponent, CenterSquareComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {
  readonly colors = GameColor;
}
