import { GameColor } from './color.model';

export enum SquareMatrix {
  SQUARE_1 = 1,
  SQUARE_2 = 2,
  SQUARE_3 = 3,
  SQUARE_4 = 4,
}

export interface ISegment {
  main: Array<number[]>;
  home: number[];
  color: GameColor;
  diceColor: string;
  cssClass: string;
  playerName?: string;
  idPrefix: string;
}
