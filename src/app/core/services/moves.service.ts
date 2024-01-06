import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  inject,
} from '@angular/core';
import { Pawn, Player } from '../../model';
import { BehaviorSubject } from 'rxjs';

type cb = (
  pawn: Pawn,
  position: number,
  madeAkill: boolean,
  player: Player,
  players: Player[],
  killedPawn?: Pawn
) => void;

@Injectable({ providedIn: 'root' })
export class MoveService {
  private readonly rendererFactory = inject(RendererFactory2);
  @Inject(DOCUMENT) private readonly document = inject(DOCUMENT);

  private readonly _selectedFigure$ = new BehaviorSubject<{
    player: Player;
    value: number;
  } | null>(null);
  readonly selectedFigure$ = this._selectedFigure$.asObservable();

  private renderer2: Renderer2;

  constructor() {
    this.renderer2 = this.rendererFactory.createRenderer(null, null);
  }

  highlightPlayablePawns(moveValue: number, player: Player) {
    const isAllInHouse = player.pawns.every((pawn) => pawn.position === -1);
    if (isAllInHouse && moveValue != 6) {
      alert('This move cannot be made. You do not have any pawn outside');
      return;
    }

    if (moveValue === 6) {
      this.highlightAllActivePawn(player.pawns, (p) => !p.done);
    } else {
      this.highlightAllActivePawn(
        player.pawns,
        (p) => !p.done && p.position != -1
      );
    }
    this._selectedFigure$.next({ player, value: moveValue });
  }

  playMove(
    pawn: Pawn,
    moveValue: number,
    player: Player,
    players: Player[],
    diceSum: number,
    cb: cb
  ) {
    const traveller = this.document.getElementById(pawn.id);
    const pawnIdInitial = pawn.id.substring(0, 1);
    if (pawn.position === -1) {
      this.playHomePawn(pawnIdInitial, traveller, player);
      // Todo please kindly check if a kill happened in the future
      cb(pawn, 8, false, player, players);
      return true;
    }
    this.playOutsidePawn(
      pawnIdInitial,
      traveller,
      player,
      moveValue,
      diceSum,
      true
    );
    return true;
  }

  private playOutsidePawn(
    pawnIdInitial: string,
    traveller: HTMLElement | null,
    player: Player,
    moveValue: number,
    diceSum: number,
    animate: boolean = false
  ) {
    let i = 0;
    let mvCount = 1;
    const interval = setInterval(
      () => {
        ++i;
        //This gives us a concrete headsup where the element is located
        const currLocationId = traveller?.parentElement?.id;
        if (currLocationId) {
          const homePrefix = currLocationId.substring(0, 1);
          const homeSuffix = +currLocationId.split('-')[2];
          if (pawnIdInitial === homePrefix && homeSuffix === 6) {
            // at this point it should go home
          } else if (homeSuffix === 12) {
          } else {
            this.domMover(homePrefix, homeSuffix, mvCount, traveller);
          }
        } else {
          throw new Error('Invalid location detected');
        }
        console.log(i, moveValue, mvCount, 'na them');
        if (i === moveValue) {
          clearInterval(interval);
        }
      },
      animate ? 300 : 0
    );
    // deselect all pawns
    this.deselectAllActivePowns(player.pawns, (p) => !!p);
    this._selectedFigure$.next({ player, value: 0 });
  }

  //   private playOutsidePawn(
  //     pawnIdInitial: string,
  //     traveller: HTMLElement | null,
  //     player: Player,
  //     moveValue: number,
  //     diceSum: number
  //   ) {
  //     //This gives us a concrete headsup where the element is located
  //     const currLocationId = traveller?.parentElement?.id;
  //     if (currLocationId) {
  //       const homePrefix = currLocationId.substring(0, 1);
  //       const homeSuffix = +currLocationId.split('-')[2];

  //       if (pawnIdInitial === homePrefix && homeSuffix === 6) {
  //         // at this point it should go home
  //       }
  //       if (homeSuffix === 12) {
  //         // at this point it's at the end of the road and needs to make a new turn
  //       } else {
  //         // proceed with the normal flow and call recursively for as along as moveValue is not 1;

  //         this.domMover(homePrefix, homeSuffix, 1, traveller);

  //         if (moveValue > 1) {
  //           this.playOutsidePawn(
  //             pawnIdInitial,
  //             traveller,
  //             player,
  //             --moveValue,
  //             diceSum
  //           );
  //         }
  //       }
  //     } else {
  //       throw new Error('Invalid location detected');
  //     }
  //   }

  private domMover(
    homePrefix: string,
    homeSuffix: number,
    steps: number,
    traveller: HTMLElement | null
  ) {
    const destination = this.document.getElementById(
      homePrefix + '-road-' + (homeSuffix + steps)
    ) as HTMLDivElement | null;
    this.renderer2.appendChild(destination, traveller);
    console.log(destination?.childElementCount);
    return destination;
  }

  /**
   * @description This method helps with moving a pawn out of the house
   * @param pawnIdInitial
   * @param traveller
   * @param player
   */
  private playHomePawn(
    pawnIdInitial: string,
    traveller: HTMLElement | null,
    player: Player
  ) {
    const destination = this.document.getElementById(
      pawnIdInitial + '-road-8'
    ) as HTMLDivElement | null;
    this.renderer2.appendChild(destination, traveller);

    // deselect all pawns
    this.deselectAllActivePowns(player.pawns, (p) => !!p);
    this._selectedFigure$.next({ player, value: 0 });
  }

  /**
   * @description Please use this method only when you want to highlight user eligible pawns
   * @param pawns the pawns for the active game player
   * @param filtFn a function containing your filter logic to select applicable pawns
   */
  highlightAllActivePawn(pawns: Pawn[], filtFn: (p: Pawn) => boolean) {
    pawns.filter(filtFn).forEach((p) => {
      const el = this.document.getElementById(p.id) as HTMLDivElement | null;
      if (el) this.renderer2.addClass(el, 'highlight');
    });
  }

  /**
   * @description use method to deselect all selected pawns
   * @param pawns
   * @param filtFn
   */
  deselectAllActivePowns(pawns: Pawn[], filtFn: (p: Pawn) => boolean) {
    pawns.filter(filtFn).forEach((p) => {
      const el = this.document.getElementById(p.id) as HTMLDivElement | null;
      if (el) this.renderer2.removeClass(el, 'highlight');
    });
  }
}
