import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  distinctUntilChanged,
  finalize,
  last,
  map,
  share,
  switchMap,
  take,
  takeLast,
  tap,
  timer,
} from 'rxjs';
import { SoundEnum, SoundManager } from '../util/sound-manager';

@Injectable({ providedIn: 'root' })
export class DiceService {
  private readonly _hasRolledDice$ = new BehaviorSubject(false);
  readonly hasRolledDice$ = this._hasRolledDice$
    .asObservable()
    .pipe(share(), distinctUntilChanged());

  private readonly _die1$ = new BehaviorSubject(1);
  readonly die1$ = this._die1$.asObservable().pipe(share());
  private readonly _die2$ = new BehaviorSubject(1);
  readonly die2$ = this._die2$.asObservable().pipe(share());

  private readonly sound = new SoundManager(SoundEnum.DICE_ROLL_SOUND);

  rollDice() {
    this.sound.stop();
    this.sound.play();
    this.spinTheDie(this._die2$);
    this.spinTheDie(this._die1$, true);
  }

  private spinTheDie(sub: BehaviorSubject<number>, shouldNotifyDone = false) {
    return timer(0, 50)
      .pipe(
        take(10),
        map((_) => {
          let total = Number((Math.random() * (6 - 1) + 1).toFixed(0));
          return total;
        })
      )
      .subscribe({
        next: (d) => sub.next(6),
        complete: () => {
          if (shouldNotifyDone) {
            sub.next(55);
            this._hasRolledDice$.next(true);
          }
        },
      });
  }

  markHasRolledDiceAsFalse() {
    this._hasRolledDice$.next(false);
  }

  resetDie1() {
    this._die1$.next(0);
  }

  resetDie2() {
    this._die2$.next(0);
  }

  resetDice() {
    this.resetDie1();
    this.resetDie2();
  }
}
