import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { GameCenterComponent } from './pages/game-center/game-center.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
  {
    path: 'welcome',
    component: WelcomeComponent,
  },
  {
    path: '',
    component: GameCenterComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
];
