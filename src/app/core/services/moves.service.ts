import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  inject,
} from '@angular/core';
import { Pawn, Player } from '../../model';

@Injectable({ providedIn: 'root' })
export class MoveService {
  private readonly rendererFactory = inject(RendererFactory2);
  @Inject(DOCUMENT) private readonly document = inject(DOCUMENT);

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
    setTimeout(() => {
      const destination = this.document.getElementById('l-road-7');
      const traveller = this.document.getElementById('lce-0');
      this.renderer2.appendChild(destination, traveller);
    }, 10000);
  }

  playMove(moveValue: number) {}

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
}
