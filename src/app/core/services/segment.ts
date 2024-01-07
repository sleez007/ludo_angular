import { Injectable } from '@angular/core';
import { GameColor, ISegment, Player, SquareMatrix } from '../../model';
import { availableColors } from '../util/colors.data';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Segment {
  private _segments$ = new BehaviorSubject<
    { [x in SquareMatrix]: ISegment } | null
  >(null);
  readonly segments$ = this._segments$.asObservable();

  generateSegments(players: Player[]) {
    if (players.length === 2) {
      this.setSegmentForTwoPlayers(players);
    } else if (players.length === 4) {
      this.setSegmentForFourPlayers(players);
    } else {
      throw new Error('Invalid number of players');
    }
  }

  private setSegmentForTwoPlayers(players: Player[]) {
    const pl = [players[0], players[1], players[0], players[1]];
    this.setSegmentForFourPlayers(pl);
  }

  private setSegmentForFourPlayers(players: Player[]) {
    const colors = availableColors.sort(() => Math.random() - 0.5);
    const sqr1 = this.createSquare(
      [
        [7, 8, 9, 10, 11, 12],
        [6, 0, 1, 2, 3, 4],
        [5, 4, 3, 2, 1, 0],
      ],
      [],
      'border-r border-black',
      colors[0].dice,
      'l',
      colors[0].color,
      players[0].name
    );
    const sqr2 = this.createSquare(
      [
        [5, 4, 3, 2, 1, 0],
        [6, 0, 1, 2, 3, 4],
        [7, 8, 9, 10, 11, 12],
      ],
      [],
      'border-b border-black',
      colors[1].dice,
      'u',
      colors[1].color,
      players[1].name
    );

    const sqr3 = this.createSquare(
      [
        [0, 1, 2, 3, 4, 5],
        [4, 3, 2, 1, 0, 6],
        [12, 11, 10, 9, 8, 7],
      ],
      [],
      'border-l border-black',
      colors[2].dice,
      'd',
      colors[2].color,
      players[2].name
    );

    const sqr4 = this.createSquare(
      [
        [12, 11, 10, 9, 8, 7],
        [4, 3, 2, 1, 0, 6],
        [0, 1, 2, 3, 4, 5],
      ],
      [],
      'border-t  border-black',
      colors[3].dice,
      'o',
      colors[3].color,
      players[3].name
    );
    this._segments$.next({
      [SquareMatrix.SQUARE_1]: sqr1,
      [SquareMatrix.SQUARE_2]: sqr2,
      [SquareMatrix.SQUARE_3]: sqr3,
      [SquareMatrix.SQUARE_4]: sqr4,
    });
  }

  private createSquare(
    main: number[][],
    home: number[],
    cssClass: string,
    diceColor: string,
    idPrefix: string,
    color: GameColor,
    playerName: string
  ): ISegment {
    return {
      main,
      cssClass,
      diceColor,
      home,
      idPrefix,
      color,
      playerName,
    };
  }
}
