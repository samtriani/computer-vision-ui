import { Injectable, signal } from '@angular/core';
import { RolInfo, RolUsuario } from '../models/osa.models';

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
}
