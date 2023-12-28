export interface GameSettings {
  showMoveAnimation: boolean; // use this flag to show the moves if enabled by the player;
  numberOfPlayers: 1 | 2 | 3 | 4;
  isAgainstCPU: boolean;
  isSafetyZonesEnabled: boolean;
}
