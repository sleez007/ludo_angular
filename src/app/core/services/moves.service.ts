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

  playMove(pawn: Pawn, moveValue: number, player: Player) {
    const traveller = this.document.getElementById(pawn.id);
    const pawnIdInitial = pawn.id.substring(0, 1);
    let destination: HTMLDivElement | null = null;
    if (pawn.position === -1) {
      // move the pawn out of the house
      destination = this.document.getElementById(
        pawnIdInitial + '-road-8'
      ) as HTMLDivElement | null;
      this.renderer2.appendChild(destination, traveller);

      // deselect all pawns
      this.deselectAllActivePowns(player.pawns, (p) => !!p);
      this._selectedFigure$.next({ player, value: 0 });
      // update the pawn position in the store
      return true;
    }

    //This gives us a concrete headsup where the element is located
    const currLocationId = traveller?.parentElement?.id;
    return true;
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
