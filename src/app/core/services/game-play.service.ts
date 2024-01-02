import { Injectable } from '@angular/core';
import { Player } from '../../model';
import {
  BehaviorSubject,
  Observable,
  Subject,
  tap,
  withLatestFrom,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private noOfPlayers = 2;
  private playerTurn$ = new BehaviorSubject(1);
  readonly isAgainstCPU$ = new BehaviorSubject(false);

  private readonly _switchTurn$ = new Subject<void>();
  private switchTurn$ = this._switchTurn$.asObservable().pipe(
    withLatestFrom(this.playerTurn$),
    tap(([, currentPlayerTurn]) => {
      const turn =
        currentPlayerTurn == this.noOfPlayers ? 1 : ++currentPlayerTurn;
      this.playerTurn$.next(turn);
    })
  );
  private players$ = new BehaviorSubject<Player[]>([]);

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
    if (count === 2) {
      return [
        {
          name: 'Player 1',
          territories: [1, 4],
          score: 0,
        },
        {
          name: isAgainstCPU ? 'CPU' : 'Player 2',
          territories: [2, 3],
          score: 0,
        },
      ];
    } else if (count === 4) {
      return new Array(4).fill('k').map((_, i) => ({
        name: 'Player ' + (i + 1),
        territories: [i + 1],
        score: 0,
      }));
    } else {
      throw new Error('Invalid Argument passed for count');
    }
  }

  nextPlayer() {
    this._switchTurn$.next();
  }

  resetplayerTurn() {
    this.playerTurn$.next(1);
  }

  resetPlayers() {
    this.players$.next([]);
  }
}
