import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RolService } from '../../../core/services/rol.service';
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

  get rolActivo() {
    return this.rolService.rolActivo();
  }

  elegirRol(rol: RolUsuario) {
    this.rolService.setRol(rol);
  }
}
