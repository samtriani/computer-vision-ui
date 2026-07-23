import { Routes } from '@angular/router';
import { CapturaComponent } from './features/captura/captura.component';
import { ResultadoComponent } from './features/resultado/resultado.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';
import { authGuard, guestGuard, rolGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'captura', component: CapturaComponent, canActivate: [authGuard, rolGuard] },
  { path: 'resultado', component: ResultadoComponent, canActivate: [authGuard, rolGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard, rolGuard] },
  { path: '**', redirectTo: 'dashboard' },
];
