import { Routes } from '@angular/router';
import { CapturaComponent } from './features/captura/captura.component';
import { ResultadoComponent } from './features/resultado/resultado.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'captura', component: CapturaComponent },
  { path: 'resultado', component: ResultadoComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: 'dashboard' },
];
