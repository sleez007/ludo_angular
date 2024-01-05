import { Component, Input, inject } from '@angular/core';
import { GameColor, Pawn, Player } from '../../model';
import { EngineService } from '../../core/services/engine.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-home.component.html',
  styleUrl: './game-home.component.scss',
})
export class GameHomeComponent {
  private readonly gameEngine = inject(EngineService);
  readonly figure$ = this.gameEngine.selectedFigure$;
  @Input({ required: true }) color!: GameColor;
  @Input({ required: true }) diceColor!: string;
  @Input({ required: true }) playerName!: string;
  @Input({ required: true }) idPrefix!: string;

  pawnClick(
    id: string,
    figure: {
      player: Player;
      value: number;
    } | null
  ) {
    if (figure) {
      const pawn = figure.player.pawns.find((p) => p.id === id);
      if (pawn && figure.value != 0) {
        const isMoved = this.gameEngine.playMove(
          pawn,
          figure.value,
          figure.player
        );
        if (isMoved) {
          this.gameEngine.clearCurrentDiceVal();
        }
      }
    }
  }
}
