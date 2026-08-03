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

export type EstadoPosicion = 'vacio' | 'parcial' | 'sobrante' | 'surtido_incorrecto';

export interface HuecoDetectado {
  posicion_id: string;
  posicion: string;
  sku: string;
  producto: string;
  /** Descripción del envase como se ve en piso ("bolsa amarilla 1.3L"); el
   *  planograma solo trae la marca y se repite en casi todas las posiciones. */
  descripcion: string;
  facings_esperados: number;
  piezas_detectadas: number | null;
  /** detectadas - esperadas: negativo = faltan piezas, positivo = sobran. */
  diferencia: number | null;
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
