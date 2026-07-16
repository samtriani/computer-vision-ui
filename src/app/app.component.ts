import { Component, inject, effect } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { TopbarComponent } from './shared/components/topbar/topbar.component';
import { RolService } from './core/services/rol.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private router = inject(Router);
  private rolService = inject(RolService);

  constructor() {
    // Si el rol activo no puede ver la ruta actual, redirige a una válida para ese rol.
    effect(() => {
      const rol = this.rolService.rolActivo();
      const url = this.router.url;
      const puedeVerCaptura = rol === 'operativo' || rol === 'tienda';
      const puedeVerResultado = rol === 'tienda';
      const puedeVerDashboard = rol === 'tienda' || rol === 'ejecutivo';

      if (url.startsWith('/captura') && !puedeVerCaptura) {
        this.router.navigate(['/dashboard']);
      } else if (url.startsWith('/resultado') && !puedeVerResultado) {
        this.router.navigate([puedeVerCaptura ? '/captura' : '/dashboard']);
      } else if (url.startsWith('/dashboard') && !puedeVerDashboard) {
        this.router.navigate(['/captura']);
      }
    });
  }
}
