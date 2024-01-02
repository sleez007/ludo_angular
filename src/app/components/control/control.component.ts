import { Component, inject } from '@angular/core';
import { DiceComponent } from '../dice/dice.component';
import { EngineService } from '../../core/services/engine.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [CommonModule, DiceComponent],
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
})
export class ControlComponent {
  private readonly gameEngine = inject(EngineService);

  dice1$ = this.gameEngine.dice1$;
  dice2$ = this.gameEngine.dice2$;

  rollDice() {
    this.gameEngine.rollDice();
  }
}
