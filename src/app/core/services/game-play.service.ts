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
export class GameService {
  private noOfPlayers = 2;
  private playerTurn$ = new BehaviorSubject(1);

  private readonly _switchTurn$ = new Subject<void>();
  private switchTurn$ = this._switchTurn$.asObservable().pipe(
    withLatestFrom(this.playerTurn$),
    tap(([, currentPlayerTurn]) => {
      const turn =
        currentPlayerTurn == this.noOfPlayers ? 1 : ++currentPlayerTurn;
      this.playerTurn$.next(turn);
    })
  );
  private players: Player[] = [];

  getNoOfPlayers() {
    return this.noOfPlayers;
  }

  getCurrentTurn(): Observable<number> {
    return this.playerTurn$.asObservable();
  }

  getPlayers() {
    return Object.freeze(this.players);
  }

  setPlayers(players: Player[]) {
    this.players = players;
    this.noOfPlayers = this.players.length;
  }

  nextPlayer() {
    this._switchTurn$.next();
  }

  resetplayerTurn() {
    this.playerTurn$.next(1);
  }

  resetPlayers() {
    this.players = [];
  }
}
