export interface Player {
  name: string;
  territories: number[];
  score: number;
  pawns: Pawn[];
  pathOrder: {
    [x: number]: string[];
  };
}

export interface Pawn {
  id: string;
  killed: string[];
  killedBy: string[];
  position: number;
  territoryId: number;
}
