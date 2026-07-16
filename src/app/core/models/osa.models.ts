export type RolUsuario = 'operativo' | 'tienda' | 'ejecutivo';

export interface RolInfo {
  id: RolUsuario;
  nombre: string;
  descripcion: string;
  icono: string;
}

// Las 10 causas de desabasto del reporte F9 (AS-IS) — ver memoria del proyecto
// "f9-desabasto-report" para la interpretación de cada una y qué falta confirmar
// con el dueño del reporte.
export type CausaHueco =
  | 'error_operativo'
  | 'en_bodega'
  | 'otra_posicion'
  | 'diferencia_inventario'
  | 'generar_pedido_sucursal'
  | 'sin_rol'
  | 'pendiente_generar_pedido'
  | 'proveedor_no_entrego'
  | 'proveedor_no_despacho'
  | 'mercancia_transito';

export type Responsable = 'tienda' | 'sin_rol' | 'central' | 'proveedor' | 'logistica';

export interface Hueco {
  id: string;
  sku: string;
  producto: string;
  posicion: string;
  causa: CausaHueco;
  detalle: string;
  bodega: number;
  sistema: number;
}

export type Formato = 'LA COMER' | 'CITY MARKET' | 'FRESKO' | 'SUMESAS';

export interface Tienda {
  id: string;
  nombre: string;
  formato: Formato;
  subdirector: string;
  osa: number;
  huecos: number;
  ventaPerdidaDia: number;
  cumplimientoF9: number;
}

export interface CategoriaOsa {
  nombre: string;
  osa: number;
}

export interface OsaPorHora {
  hora: string;
  osa: number;
}

export interface CausaF9 {
  causa: CausaHueco;
  pct: number;
}

export interface FormatoSubdirector {
  formato: Formato;
  subdirector: string;
  tiendas: number;
  sinRolPct: number;
  cumplimientoProm: number;
  articulosEscaneadosProm: number;
}

export const CAUSA_LABEL: Record<CausaHueco, string> = {
  error_operativo: 'Error operativo',
  en_bodega: 'En bodega',
  otra_posicion: 'En otra posición',
  diferencia_inventario: 'Diferencia de inventario (EO)',
  generar_pedido_sucursal: 'Generar pedido sucursal',
  sin_rol: 'Sin rol',
  pendiente_generar_pedido: 'Pendiente generar pedido',
  proveedor_no_entrego: 'El proveedor no ha entregado',
  proveedor_no_despacho: 'El proveedor no ha despachado la mercancía',
  mercancia_transito: 'Mercancía en tránsito',
};

// Responsable inferido por causa — ver memoria "f9-desabasto-report": pendiente de
// confirmar con el dueño del F9, especialmente "sin_rol" y el límite tienda/central.
export const CAUSA_RESPONSABLE: Record<CausaHueco, Responsable> = {
  error_operativo: 'tienda',
  en_bodega: 'tienda',
  otra_posicion: 'tienda',
  diferencia_inventario: 'tienda',
  generar_pedido_sucursal: 'tienda',
  sin_rol: 'sin_rol',
  pendiente_generar_pedido: 'central',
  proveedor_no_entrego: 'proveedor',
  proveedor_no_despacho: 'proveedor',
  mercancia_transito: 'logistica',
};

export const CAUSA_CLASE: Record<CausaHueco, string> = {
  error_operativo: 'causa-tienda',
  en_bodega: 'causa-tienda',
  otra_posicion: 'causa-tienda',
  diferencia_inventario: 'causa-tienda',
  generar_pedido_sucursal: 'causa-tienda',
  sin_rol: 'causa-sinrol',
  pendiente_generar_pedido: 'causa-central',
  proveedor_no_entrego: 'causa-proveedor',
  proveedor_no_despacho: 'causa-proveedor',
  mercancia_transito: 'causa-logistica',
};

export const RESPONSABLE_LABEL: Record<Responsable, string> = {
  tienda: 'Tienda',
  sin_rol: 'Sin clasificar',
  central: 'Planeación / Central',
  proveedor: 'Proveedor',
  logistica: 'Logística',
};

export const RESPONSABLE_COLOR: Record<Responsable, string> = {
  tienda: 'var(--naranja)',
  sin_rol: 'var(--tinta-3)',
  central: 'var(--ambar)',
  proveedor: 'var(--rojo)',
  logistica: 'var(--verde)',
};
