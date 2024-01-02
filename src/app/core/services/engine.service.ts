import { Injectable, inject } from '@angular/core';
import { DiceService } from './dice.service';
import { PlayerService } from './game-play.service';
import { Segment } from './segment';
import { Subject, startWith, tap, withLatestFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EngineService {
  private readonly playerService = inject(PlayerService);
  private readonly diceService = inject(DiceService);
  private readonly segment = inject(Segment);
  readonly dice1$ = this.diceService.dice1$;
  readonly dice2$ = this.diceService.dice2$;
  readonly gameSegments$ = this.segment.segments$;

  private readonly _gameStart$ = new Subject<void>();
  readonly gameStart$ = this._gameStart$.asObservable().pipe(
    startWith(''),
    withLatestFrom(this.playerService.getPlayers()),
    tap(([, players]) => this.segment.generateSegments(players))
  );

  rollDice() {
    this.diceService.rollDice();
  }

  setNumberOfPlayers(no: 2 | 4, isAgainstCPU: boolean) {
    this.playerService.setPlayers(no, isAgainstCPU);
  }

  startGame() {
    this.playerService.resetplayerTurn();
    this._gameStart$.next();
    console.log('start game');
  }

  restartGame() {
    // restart game and set looser to be the first player
  }

  resetGame() {
    //clear score
    this.playerService.resetplayerTurn();
    this.playerService.resetPlayers();
  }
}
