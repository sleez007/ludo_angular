import { Component, Inject, OnInit, Renderer2, inject } from '@angular/core';
import { GameHomeComponent } from '../../components/game-home/game-home.component';
import { SquareGridComponent } from '../../components/square-grid/square-grid.component';
import { CenterSquareComponent } from '../../components/center-square/center-square.component';
import { SquareMatrix } from '../../model';
import { EngineService } from '../../core/services/engine.service';
import { DOCUMENT } from '@angular/common';
import { ControlComponent } from '../../components/control/control.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    GameHomeComponent,
    SquareGridComponent,
    CenterSquareComponent,
    ControlComponent,
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent implements OnInit {
  private readonly renderer2 = inject(Renderer2);
  @Inject(DOCUMENT) private readonly document = inject(DOCUMENT);
  private readonly gameEngine = inject(EngineService);
  readonly squareMatrix = SquareMatrix;

  readonly colorSegment = this.gameEngine.getColorSegments();
  ngOnInit(): void {
    this.gameEngine.startGame();

    setTimeout(() => {
      const destination = this.document.getElementById('l-road-7');
      const traveller = this.document.getElementById('lce-0');
      this.renderer2.appendChild(destination, traveller);
    }, 10000);
  }
}
