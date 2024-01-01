import { Component } from '@angular/core';
import { DiceComponent } from '../dice/dice.component';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [DiceComponent],
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
})
export class ControlComponent {}
