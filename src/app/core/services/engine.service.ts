import { Injectable, inject } from '@angular/core';
import { DiceService } from './dice.service';
import { PlayerService } from './game-play.service';
import { Segment } from './segment';
import {
  BehaviorSubject,
  Subject,
  distinctUntilChanged,
  map,
  share,
  startWith,
  tap,
  withLatestFrom,
} from 'rxjs';
import { MoveService } from './moves.service';
import { Pawn, Player, SelectedVal } from '../../model';

@Injectable({ providedIn: 'root' })
export class EngineService {
  private readonly playerService = inject(PlayerService);
  private readonly diceService = inject(DiceService);
  private readonly segment = inject(Segment);
  private readonly moveService = inject(MoveService);
  readonly dice1$ = this.diceService.die1$;
  readonly dice2$ = this.diceService.die2$;
  readonly gameSegments$ = this.segment.segments$;

  readonly players$ = this.playerService.getPlayers();
  readonly currentTurn$ = this.playerService.getCurrentTurn();
  readonly currentPlayer$ = this.playerService.currentPlayer$;

  readonly selectedFigure$ = this.moveService.selectedFigure$;

  selectedVal: SelectedVal | null = null;

  readonly hasRolledDice$ = this.diceService.hasRolledDice$.pipe(
    withLatestFrom(
      this.currentPlayer$,
      this.dice1$,
      this.dice2$,
      this.playerService.switchTurn$
    ),
    tap(([hasRolled, player, die1, die2]) => {
      if (hasRolled) {
        if (
          !this.playerService.checkDiceValueAndIfPlayerHasPawnOutside(
            player,
            die1,
            die2
          )
        ) {
          // automatically switch play to the next user
          this.playerService.nextPlayer();
          setTimeout(() => this.diceService.markHasRolledDiceAsFalse(), 0);
        } else {
        }
      } else {
      }
    }),
    map(([hasRolled, , ,]) => hasRolled)
  );

  private readonly _gameStart$ = new Subject<void>();
  readonly gameStart$ = this._gameStart$.asObservable().pipe(
    startWith(''),
    withLatestFrom(this.playerService.getPlayers()),
    tap(([, players]) => this.segment.generateSegments(players))
  );

  private readonly _hasStartedGame$ = new BehaviorSubject(false);
  readonly hasStartedGame$ = this._hasStartedGame$.asObservable().pipe(
    tap((isStarted) => {
      if (isStarted) {
        // show toast message here to notify the user that the game has begun
      }
    })
  );

  rollDice() {
    this.diceService.rollDice();
  }

  setNumberOfPlayers(no: 2 | 4, isAgainstCPU: boolean) {
    this.playerService.setPlayers(no, isAgainstCPU);
  }

  startGame() {
    this._hasStartedGame$.next(true);
  }

  initializeGame() {
    this.playerService.resetplayerTurn();
    this._gameStart$.next();
  }

  restartGame() {
    // restart game and set looser to be the first player
  }

  resetGame() {
    //clear score
    this.playerService.resetplayerTurn();
    this.playerService.resetPlayers();
  }

  clearCurrentDiceVal() {
    switch (this.selectedVal) {
      case SelectedVal.DIE_VALUE_1: {
        this.diceService.resetDie1();
        break;
      }
      case SelectedVal.DIE_VALUE_2: {
        this.diceService.resetDie2();
        break;
      }
      case SelectedVal.DICE_VALUE: {
        this.diceService.resetDice();
        break;
      }
    }
  }

  highlightPlayablePawns(
    moveValue: number,
    player: Player,
    valuePickerId: SelectedVal
  ) {
    this.selectedVal = valuePickerId;
    this.moveService.highlightPlayablePawns(moveValue, player);
  }

  playMove(
    pawn: Pawn,
    moveValue: number,
    player: Player,
    players: Player[],
    diceSum: number
  ) {
    return this.moveService.playMove(
      pawn,
      moveValue,
      player,
      players,
      diceSum,
      this.playerService.updatePawnPosition
    );
  }
}
