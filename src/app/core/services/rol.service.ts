import { Injectable, signal } from '@angular/core';
import { RolInfo, RolUsuario } from '../models/osa.models';

// Mismas rutas que ve cada rol en la nav del topbar — única fuente de verdad,
// la usan también el guard de rutas y el login para saber a dónde mandar a
// cada rol.
const RUTAS_PERMITIDAS: Record<RolUsuario, string[]> = {
  operativo: ['/captura'],
  tienda: ['/captura', '/resultado', '/dashboard'],
  ejecutivo: ['/dashboard'],
};

@Injectable({ providedIn: 'root' })
export class RolService {
  readonly roles: RolInfo[] = [
    {
      id: 'operativo',
      nombre: 'Operativo',
      descripcion: 'Reponedor de piso · captura y tareas',
      icono: '📷',
    },
    {
      id: 'tienda',
      nombre: 'Tienda',
      descripcion: 'Gerente de tienda · análisis y dashboard local',
      icono: '🏬',
    },
    {
      id: 'ejecutivo',
      nombre: 'Ejecutivo',
      descripcion: 'Direcciones · dashboard OSA global',
      icono: '📊',
    },
  ];

  rolActivo = signal<RolUsuario>('tienda');

  setRol(rol: RolUsuario) {
    this.rolActivo.set(rol);
  }

  infoDe(rol: RolUsuario): RolInfo {
    return this.roles.find(r => r.id === rol)!;
  }

  rutasPermitidas(rol: RolUsuario = this.rolActivo()): string[] {
    return RUTAS_PERMITIDAS[rol];
  }

  rutaPorDefecto(rol: RolUsuario = this.rolActivo()): string {
    return this.rutasPermitidas(rol)[0];
  }

  rutaPermitida(url: string, rol: RolUsuario = this.rolActivo()): boolean {
    return this.rutasPermitidas(rol).some(ruta => url.startsWith(ruta));
  }
}
