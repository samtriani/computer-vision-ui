import { Routes } from '@angular/router';
import { CapturaComponent } from './features/captura/captura.component';
import { ResultadoComponent } from './features/resultado/resultado.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'captura', component: CapturaComponent, canActivate: [authGuard] },
  { path: 'resultado', component: ResultadoComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' },
];
