import { Component, Input, inject } from '@angular/core';
import { GameColor, Pawn, Player } from '../../model';
import { EngineService } from '../../core/services/engine.service';
import { CommonModule } from '@angular/common';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-game-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-home.component.html',
  styleUrl: './game-home.component.scss',
})
export class GameHomeComponent {
  private readonly gameEngine = inject(EngineService);
  readonly players$ = this.gameEngine.players$;
  readonly figure$ = this.gameEngine.selectedFigure$;
  readonly diceSum$ = combineLatest([
    this.gameEngine.dice1$,
    this.gameEngine.dice2$,
  ]).pipe(map(([dice1, dice2]) => dice1 + dice2));
  @Input({ required: true }) color!: GameColor;
  @Input({ required: true }) diceColor!: string;
  @Input({ required: true }) playerName!: string;
  @Input({ required: true }) idPrefix!: string;

  pawnClick(
    id: string,
    players: Player[],
    diceSum: number,
    figure: {
      player: Player;
      value: number;
    } | null
  ) {
    if (figure) {
      const pawn = figure.player.pawns.find((p) => p.id === id);
      if (pawn && figure.value != 0) {
        this.gameEngine.clearCurrentDiceVal();
        this.gameEngine.playMove(
          pawn,
          figure.value,
          figure.player,
          players,
          diceSum
        );
      }
    }
  }
}
