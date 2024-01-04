import { Injectable } from '@angular/core';
import { Player } from '../../model';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  map,
  startWith,
  tap,
  withLatestFrom,
} from 'rxjs';
import { pawnData } from './pawns.data';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private noOfPlayers = 2;
  private playerTurn$ = new BehaviorSubject(-1);
  readonly isAgainstCPU$ = new BehaviorSubject(false);

  private readonly _switchTurn$ = new Subject<void>();
  readonly switchTurn$ = this._switchTurn$.asObservable().pipe(
    startWith(null),
    withLatestFrom(this.playerTurn$),
    tap(([, currentPlayerTurn]) => {
      const turn =
        currentPlayerTurn == this.noOfPlayers - 1 ? 0 : currentPlayerTurn + 1;
      this.playerTurn$.next(turn);
    })
  );
  private players$ = new BehaviorSubject<Player[]>([]);

  readonly currentPlayer$ = combineLatest([
    this.players$,
    this.playerTurn$,
  ]).pipe(
    map(([players, currentPlayerIndex]) => players?.[currentPlayerIndex])
  );

  getNoOfPlayers() {
    return this.noOfPlayers;
  }

  getCurrentTurn(): Observable<number> {
    return this.playerTurn$.asObservable();
  }

  getPlayers() {
    return this.players$.asObservable();
  }

  setPlayers(no: 2 | 4, isAgainstCPU: boolean) {
    const players = this.generatePlayersInfo(no, isAgainstCPU);
    this.players$.next(players);
    this.noOfPlayers = players.length;
  }

  private generatePlayersInfo(count: 2 | 4, isAgainstCPU: boolean): Player[] {
    const data = pawnData;
    if (count === 2) {
      return [
        {
          name: 'Player 1',
          territories: [1, 4],
          score: 0,
          pathOrder: {
            1: data[0].pathOrder,
            4: data[3].pathOrder,
          },
          pawns: [...data[0].pawns, ...data[3].pawns],
        },
        {
          name: isAgainstCPU ? 'CPU' : 'Player 2',
          territories: [2, 3],
          score: 0,
          pathOrder: {
            2: data[1].pathOrder,
            3: data[2].pathOrder,
          },
          pawns: [...data[1].pawns, ...data[2].pawns],
        },
      ];
    } else if (count === 4) {
      return new Array(4).fill('k').map((_, i) => ({
        name: 'Player ' + (i + 1),
        territories: [i + 1],
        pathOrder: {
          [i + 1]: data[i].pathOrder,
        },
        pawns: data[i].pawns,
        score: 0,
      }));
    } else {
      throw new Error('Invalid Argument passed for count');
    }
  }

  nextPlayer() {
    console.log('should switch turns');
    this._switchTurn$.next();
  }

  resetplayerTurn() {
    this.playerTurn$.next(-1);
  }

  resetPlayers() {
    this.players$.next([]);
  }

  /**
   *
   * @param player The current player
   * @param dice1 The value on the first die
   * @param dice2 The value on the second die
   * @returns true if the player is eligible to play and returns false if we should automatically switch play to next players turn
   */
  checkDiceValueAndIfPlayerHasPawnOutside(
    player: Player,
    dice1: number,
    dice2: number
  ): boolean {
    const isAllInHouse = player.pawns.every((pawn) => pawn.position === -1);
    const result = !(dice1 != 6 && dice2 != 6 && isAllInHouse);
    console.log('see...', dice1, dice2, isAllInHouse, result);
    return result;
  }
}
