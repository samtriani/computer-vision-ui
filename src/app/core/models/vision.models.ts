export interface PosicionPlanograma {
  id: string;
  posicion: string;
  sku: string;
  producto: string;
  facings_esperados: number;
}

export interface Planograma {
  seccion_id: string;
  nombre: string;
  posiciones: PosicionPlanograma[];
}

export type EstadoPosicion = 'vacio' | 'parcial';

export interface HuecoDetectado {
  posicion_id: string;
  posicion: string;
  sku: string;
  producto: string;
  facings_esperados: number;
  estado: EstadoPosicion;
  confianza: number;
}

export interface AnalizarImagenResponse {
  seccion_id: string;
  resumen: string;
  huecos: HuecoDetectado[];
}

export interface HuecoVisual {
  id: string;
  nivel: number;
  posicion: string;
  categoria_esperada: string;
  marcas_esperadas: string;
  estado: EstadoPosicion;
  confianza: number;
}

export interface AnalizarConReferenciaResponse {
  resumen: string;
  huecos: HuecoVisual[];
}

export interface CategoriaVisual {
  id: string;
  nombre: string;
}
