import { Injectable } from '@angular/core';
import { Subject, map, switchMap, take, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DiceService {
  private readonly startDice1$ = new Subject<void>();
  private readonly startDice2$ = new Subject<void>();
  readonly dice1$ = this.startDice1$.pipe(switchMap(() => this.spinTheDice()));
  readonly dice2$ = this.startDice2$.pipe(switchMap(() => this.spinTheDice()));

  rollDice() {
    this.startDice1$.next();
    this.startDice2$.next();
  }

  private spinTheDice() {
    return timer(0, 50).pipe(
      take(10),
      map((_) => {
        let total = Number((Math.random() * (6 - 1) + 1).toFixed(0));
        return total;
      })
    );
  }
}
