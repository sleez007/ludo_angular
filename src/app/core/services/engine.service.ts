import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameColor, ISegment, Player, SquareMatrix } from '../../model';
import { GameService } from './game-play.service';

@Injectable({ providedIn: 'root' })
export class EngineService {
  private readonly gameService = inject(GameService);
  houseArrangements: Array<GameColor> = [];
  private readonly availableColors = [
    GameColor.BLUE,
    GameColor.GREEN,
    GameColor.RED,
    GameColor.YELLOW,
  ];

  private colorSegment: { [x in SquareMatrix]: ISegment } = {
    [SquareMatrix.SQUARE_1]: {
      main: [
        [7, 8, 9, 10, 11, 12],
        [6, 0, 1, 2, 3, 4],
        [5, 4, 3, 2, 1, 0],
      ],
      home: [],
      color: GameColor.BLUE,
      diceColor: '#18399a',
      cssClass: 'border-r border-black',
      idPrefix: 'l',
    },
    [SquareMatrix.SQUARE_2]: {
      main: [
        [5, 4, 3, 2, 1, 0],
        [6, 0, 1, 2, 3, 4],
        [7, 8, 9, 10, 11, 12],
      ],
      home: [],
      color: GameColor.RED,
      diceColor: '#b30000',
      cssClass: 'border-b border-black',
      idPrefix: 'u',
    },
    [SquareMatrix.SQUARE_3]: {
      main: [
        [12, 11, 10, 9, 8, 7],
        [4, 3, 2, 1, 0, 6],
        [0, 1, 2, 3, 4, 5],
      ],
      home: [],
      color: GameColor.YELLOW,
      diceColor: '#b2b300',
      cssClass: 'border-t border-black',
      idPrefix: 'd',
    },
    [SquareMatrix.SQUARE_4]: {
      main: [
        [0, 1, 2, 3, 4, 5],
        [4, 3, 2, 1, 0, 6],
        [12, 11, 10, 9, 8, 7],
      ],
      home: [],
      color: GameColor.GREEN,
      diceColor: '#00b300',
      cssClass: 'border-l border-black',
      idPrefix: 'o',
    },
  };

  getColorSegments() {
    return Object.freeze(this.colorSegment);
  }

  setColorSegments() {
    if (this.availableColors.length !== 4)
      throw new Error('Invalid color segments');
    this.houseArrangements = this.availableColors.sort(
      () => Math.random() - 0.5
    );
    this.colorSegment[1].color = this.houseArrangements[0];
    this.colorSegment[2].color = this.houseArrangements[1];
    this.colorSegment[3].color = this.houseArrangements[2];
    this.colorSegment[4].color = this.houseArrangements[3];
    this.setDiceColors();
  }

  private setDiceColors() {
    for (let key in this.colorSegment) {
      const segment = (this.colorSegment as any)[key] as ISegment;
      switch (segment.color) {
        case GameColor.BLUE: {
          segment.diceColor = '#18399a';
          break;
        }
        case GameColor.GREEN: {
          segment.diceColor = '#00b300';
          break;
        }
        case GameColor.RED: {
          segment.diceColor = '#b30000';
          break;
        }
        case GameColor.YELLOW: {
          segment.diceColor = '#e5e600';
          break;
        }
      }
    }
    this.colorSegment[1].color = this.houseArrangements[0];
    this.colorSegment[2].color = this.houseArrangements[1];
    this.colorSegment[3].color = this.houseArrangements[2];
    this.colorSegment[4].color = this.houseArrangements[3];
  }

  setNumberOfPlayer(no: 2 | 4) {
    const players: Player[] = [
      {
        name: 'Player 1',
        territories: [1, 3],
        score: 0,
      },
      {
        name: 'Player 2',
        territories: [2, 4],
        score: 0,
      },
    ];
    this.gameService.setPlayers(players);
  }

  setPlayerNameOnSegment() {
    const players = this.gameService.getPlayers();
    if (players.length === 2) {
      this.colorSegment[1].playerName = players[0].name;
      this.colorSegment[4].playerName = players[0].name;

      this.colorSegment[2].playerName = players[1].name;
      this.colorSegment[3].playerName = players[1].name;
    } else if (players.length === 4) {
      this.colorSegment[1].playerName = players[0].name;
      this.colorSegment[2].playerName = players[1].name;
      this.colorSegment[3].playerName = players[2].name;
      this.colorSegment[4].playerName = players[3].name;
    } else {
      throw new Error('Invalid argument was passed for number of players');
    }
  }

  startGame() {
    this.setNumberOfPlayer(2);
    this.setColorSegments();
    this.setPlayerNameOnSegment();
    this.gameService.resetplayerTurn();
  }

  resetGame() {
    // clear score and all of that
    this.gameService.resetplayerTurn();
    this.gameService.resetPlayers();
  }
}
