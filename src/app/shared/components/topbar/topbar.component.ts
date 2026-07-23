import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RolService } from '../../../core/services/rol.service';
import { AuthService } from '../../../core/services/auth.service';
import { RolUsuario } from '../../../core/models/osa.models';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
  rolService = inject(RolService);
  authService = inject(AuthService);
  private router = inject(Router);

  get rolActivo() {
    return this.rolService.rolActivo();
  }

  elegirRol(rol: RolUsuario) {
    this.rolService.setRol(rol);
    if (!this.rolService.rutaPermitida(this.router.url, rol)) {
      this.router.navigate([this.rolService.rutaPorDefecto(rol)]);
    }
  }

  cerrarSesion() {
    this.authService.logout();
  }
}
