import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';
import { GameHomeComponent } from '../../components/game-home/game-home.component';
import { SquareGridComponent } from '../../components/square-grid/square-grid.component';
import { CenterSquareComponent } from '../../components/center-square/center-square.component';
import { SquareMatrix } from '../../model';
import { EngineService } from '../../core/services/engine.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ControlComponent } from '../../components/control/control.component';
import { tap } from 'rxjs';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
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
  readonly cd = inject(ChangeDetectorRef);
  private readonly gameEngine = inject(EngineService);
  readonly squareMatrix = SquareMatrix;
  readonly segments$ = this.gameEngine.gameSegments$.pipe(
    tap(() => setTimeout(() => this.cd.detectChanges(), 0))
  );
  readonly initialized$ = this.gameEngine.gameStart$;

  ngOnInit(): void {
    this.gameEngine.setNumberOfPlayers(2, false);
    this.gameEngine.initializeGame();
    // setTimeout(() => {
    //   const destination = this.document.getElementById('l-road-7');
    //   const traveller = this.document.getElementById('lce-0');
    //   this.renderer2.appendChild(destination, traveller);
    // }, 10000);
  }
}
