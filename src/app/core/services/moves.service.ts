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
      pawn,
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
    pawn: Pawn,
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
          const homeSuffix =
            +currLocationId.split('-')[currLocationId.split('-').length - 1];
          if (pawnIdInitial === homePrefix && homeSuffix === 6) {
            this.domMover(
              homePrefix,
              0,
              0,
              traveller,
              currLocationId,
              pawnIdInitial,
              true
            );
            // at this point it should go home
          } else if (homeSuffix === 12) {
            const routes = player.pathOrder[pawn.territoryId];
            const currIndex = routes.findIndex((s) => s === homePrefix);
            if (currIndex == -1 || currIndex == routes.length - 1)
              throw new Error('Invalid next');

            const nextMaze = routes[currIndex + 1];

            this.domMover(
              nextMaze,
              0,
              0,
              traveller,
              currLocationId,
              pawnIdInitial
            );
          } else {
            this.domMover(
              homePrefix,
              homeSuffix,
              mvCount,
              traveller,
              currLocationId,
              pawnIdInitial
            );
          }
        } else {
          throw new Error('Invalid location detected');
        }

        if (i === moveValue) {
          clearInterval(interval);
        }
      },
      animate ? 250 : -1000
    );
    // deselect all pawns
    this.deselectAllActivePowns(player.pawns, (p) => !!p);
    this._selectedFigure$.next({ player, value: 0 });
  }

  //   private playOutsidePawnNoAnim(
  //     pawnIdInitial: string,
  //     traveller: HTMLElement | null,
  //     player: Player,
  //     moveValue: number,
  //     diceSum: number,
  //     pawn: Pawn
  //   ) {
  //     //This gives us a concrete headsup where the element is located
  //     const currLocationId = traveller?.parentElement?.id;
  //     if (currLocationId) {
  //       const homePrefix = currLocationId.substring(0, 1);
  //       const homeSuffix =
  //         +currLocationId.split('-')[currLocationId.split('-').length - 1];
  //       if (pawnIdInitial === homePrefix && homeSuffix === 6) {
  //         //alert('bug');
  //         // at this point it should go home
  //       } else if (homeSuffix === 12) {
  //         const routes = player.pathOrder[pawn.territoryId];
  //         const currIndex = routes.findIndex((s) => s === homePrefix);
  //         if (currIndex == -1 || currIndex == routes.length - 1)
  //           throw new Error('Invalid next');

  //         const nextMaze = routes[currIndex + 1];

  //         this.domMover(nextMaze, 0, 0, traveller);
  //       } else {
  //         this.domMover(homePrefix, homeSuffix, moveValue, traveller);
  //       }
  //     } else {
  //       throw new Error('Invalid location detected');
  //     }
  //   }

  private domMover(
    homePrefix: string,
    homeSuffix: number,
    steps: number,
    traveller: HTMLElement | null,
    id: string,
    pawnIdInitial: string,
    isFinal = false
  ) {
    const finalr = isFinal || id.includes('-inner-road-');
    const road = finalr ? '-inner-road-' : '-road-';
    const destination = this.document.getElementById(
      homePrefix + road + (homeSuffix + steps)
    ) as HTMLDivElement | null;
    this.renderer2.appendChild(destination, traveller);
    //console.log(destination?.childElementCount);
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
