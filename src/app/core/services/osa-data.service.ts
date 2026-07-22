import { Injectable, signal } from '@angular/core';
import {
  CategoriaOsa,
  CausaF9,
  CausaHueco,
  FormatoSubdirector,
  Hueco,
  OsaPorHora,
  Tienda,
} from '../models/osa.models';

@Injectable({ providedIn: 'root' })
export class OsaDataService {
  // ---- Estado de la última "captura" analizada (dummy) ----
  analizando = signal(false);
  huecos = signal<Hueco[]>([
    {
      id: 'H-01',
      sku: '750102-334',
      producto: 'Alpura Light 1L',
      posicion: 'Charola 1, posición 3',
      causa: 'en_bodega',
      causaConfirmada: false,
      detalle: 'Bodega de tienda: 46 pzs · Sistema: 46 pzs. El producto existe, no se ha repuesto al anaquel.',
      bodega: 46,
      sistema: 46,
    },
    {
      id: 'H-02',
      sku: '750102-518',
      producto: 'Alpura Yogurt Griego 1kg',
      posicion: 'Charola 2, posición 2',
      causa: 'proveedor_no_entrego',
      causaConfirmada: false,
      detalle: 'Bodega: 0 pzs · Sistema: 0 pzs. Última recepción hace 6 días. Posible falla de fill rate del proveedor.',
      bodega: 0,
      sistema: 0,
    },
    {
      id: 'H-03',
      sku: '750301-072',
      producto: 'Philadelphia 190g',
      posicion: 'Charola 3, posición 4',
      causa: 'diferencia_inventario',
      causaConfirmada: false,
      detalle: 'Sistema: 12 pzs · Físico no localizado en bodega ni anaquel. Requiere conteo cíclico.',
      bodega: 0,
      sistema: 12,
    },
  ]);

  // ---- Datos ejecutivos (dummy, con la estructura real del F9: Formato / Subdirector / cumplimiento) ----
  tiendas: Tienda[] = [
    { id: 't1', nombre: 'La Comer Insurgentes', formato: 'LA COMER', subdirector: 'Subdirección Centro', osa: 93.8, huecos: 31, ventaPerdidaDia: 14200, cumplimientoF9: 86 },
    { id: 't2', nombre: 'Fresko Del Valle', formato: 'FRESKO', subdirector: 'Subdirección Sur', osa: 89.5, huecos: 48, ventaPerdidaDia: 22700, cumplimientoF9: 69 },
    { id: 't3', nombre: 'City Market Polanco', formato: 'CITY MARKET', subdirector: 'Subdirección Norte', osa: 95.2, huecos: 19, ventaPerdidaDia: 9800, cumplimientoF9: 91 },
    { id: 't4', nombre: 'Sumesa Nápoles', formato: 'SUMESAS', subdirector: 'Subdirección Sur', osa: 86.1, huecos: 39, ventaPerdidaDia: 18300, cumplimientoF9: 58 },
  ];

  categorias: CategoriaOsa[] = [
    { nombre: 'Lácteos', osa: 86.0 },
    { nombre: 'Abarrotes secos', osa: 95.1 },
    { nombre: 'Cuidado personal', osa: 93.4 },
    { nombre: 'Bebidas', osa: 89.2 },
    { nombre: 'Botanas', osa: 81.7 },
    { nombre: 'Limpieza', osa: 96.3 },
  ];

  serieHoraria: OsaPorHora[] = [
    { hora: '7 am', osa: 96 },
    { hora: '9 am', osa: 94 },
    { hora: '11 am', osa: 91 },
    { hora: '1 pm', osa: 85 },
    { hora: '3 pm', osa: 82 },
    { hora: '6 pm', osa: 88 },
    { hora: '9 pm', osa: 93 },
  ];

  // Las 10 causas del F9 (AS-IS), % del total detectado — dummy pero calibrado
  // para que "sin_rol" domine (~38%), igual que en el reporte real.
  causasSemana: CausaF9[] = [
    { causa: 'sin_rol', pct: 38 },
    { causa: 'en_bodega', pct: 18 },
    { causa: 'error_operativo', pct: 12 },
    { causa: 'diferencia_inventario', pct: 9 },
    { causa: 'generar_pedido_sucursal', pct: 7 },
    { causa: 'pendiente_generar_pedido', pct: 6 },
    { causa: 'proveedor_no_entrego', pct: 5 },
    { causa: 'otra_posicion', pct: 3 },
    { causa: 'proveedor_no_despacho', pct: 1.5 },
    { causa: 'mercancia_transito', pct: 0.5 },
  ];

  // Pivot "Formato - Subdirector" del F9 — dummy, calibrado sobre el hallazgo real
  // del AS-IS: LA COMER clasifica mejor (~30% Sin Rol) que City Market/Sumesas (~55%).
  formatoSubdirector: FormatoSubdirector[] = [
    { formato: 'LA COMER', subdirector: 'Subdirección Centro', tiendas: 22, sinRolPct: 30, cumplimientoProm: 82, articulosEscaneadosProm: 340 },
    { formato: 'CITY MARKET', subdirector: 'Subdirección Norte', tiendas: 14, sinRolPct: 53, cumplimientoProm: 74, articulosEscaneadosProm: 210 },
    { formato: 'FRESKO', subdirector: 'Subdirección Sur', tiendas: 18, sinRolPct: 47, cumplimientoProm: 69, articulosEscaneadosProm: 195 },
    { formato: 'SUMESAS', subdirector: 'Subdirección Sur', tiendas: 11, sinRolPct: 56, cumplimientoProm: 61, articulosEscaneadosProm: 160 },
  ];

  // El modelo de visión solo detecta QUE hay un hueco; la causa (el "por qué" del
  // F9) la sugiere cruzando bodega/sistema y el operador la confirma o la corrige
  // desde el cataloguito de 10 causas — igual que hoy hace el auxiliar con el
  // escáner, pero más rápido.
  actualizarCausa(id: string, causa: CausaHueco) {
    this.huecos.update(lista =>
      lista.map(h => (h.id === id ? { ...h, causa, causaConfirmada: true } : h))
    );
  }

  confirmarCausa(id: string) {
    this.huecos.update(lista =>
      lista.map(h => (h.id === id ? { ...h, causaConfirmada: true } : h))
    );
  }

  analizarImagen(): Promise<void> {
    this.analizando.set(true);
    return new Promise(resolve => {
      setTimeout(() => {
        this.analizando.set(false);
        resolve();
      }, 2200);
    });
  }
}
