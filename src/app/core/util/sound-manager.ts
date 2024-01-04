export enum SoundEnum {
  DICE_ROLL_SOUND = '/assets/sounds/roll_dice.mp3',
  GAME_MOVE_SOUND = '/assets/sounds/move.mp3',
  GAME_OVER_SOUND = '/assets/sounds/game_over.mp3',
  NEW_GAME = '/assets/sounds/new_game.mp3',
}

export class SoundManager {
  private audio: HTMLAudioElement;

  constructor(sound: SoundEnum) {
    this.audio = new Audio(sound);
  }

  play() {
    try {
      this.audio.play();
    } catch (ex: unknown) {
      throw new Error(
        'An error was encountered while trying to play this sound' + ex
      );
    }
  }

  pause() {
    try {
      this.audio.pause();
    } catch (ex: unknown) {
      throw new Error(
        'An error was encountered while trying to pause this sound' + ex
      );
    }
  }

  stop() {
    try {
      this.audio.pause();
      this.audio.currentTime = 0;
    } catch (ex: unknown) {
      throw new Error(
        'An error was encountered while trying to stop this sound' + ex
      );
    }
  }
}
