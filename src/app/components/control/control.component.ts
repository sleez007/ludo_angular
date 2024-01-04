import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { DiceComponent } from '../dice/dice.component';
import { EngineService } from '../../core/services/engine.service';
import { CommonModule } from '@angular/common';
import { filter, map, tap, withLatestFrom } from 'rxjs';
import { Player } from '../../model';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [CommonModule, DiceComponent],
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
})
export class ControlComponent {
  private readonly gameEngine = inject(EngineService);
  readonly cd = inject(ChangeDetectorRef);

  readonly dice1$ = this.gameEngine.dice1$;
  readonly dice2$ = this.gameEngine.dice2$;
  readonly hasRolledDice$ = this.gameEngine.hasRolledDice$;

  readonly hasStartedGame$ = this.gameEngine.hasStartedGame$;

  readonly currentTurn$ = this.gameEngine.currentTurn$;
  readonly players$ = this.gameEngine.players$;

  readonly currentPlayer$ = this.gameEngine.currentPlayer$;

  startGame() {
    this.gameEngine.startGame();
  }

  rollDice() {
    this.gameEngine.rollDice();
  }

  highlightPlayablePawns(moveValue: number, player: Player) {
    this.gameEngine.highlightPlayablePawns(moveValue, player);
  }
}
