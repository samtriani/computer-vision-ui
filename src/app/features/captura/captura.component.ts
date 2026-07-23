import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { OsaDataService } from '../../core/services/osa-data.service';
import { VisionService } from '../../core/services/vision.service';
import { AnalizarConReferenciaResponse, AnalizarImagenResponse, Planograma } from '../../core/models/vision.models';
import { CAUSA_LABEL, CausaHueco, Hueco } from '../../core/models/osa.models';

interface Categoria {
  id: string;
  nombre: string;
  // Un mismo "Pasillo / Categoría" puede tener catálogo de SKU (secciones con
  // posiciones estructuradas), foto de referencia (modo visual), o ambos —
  // aquí no siempre coinciden, por eso el selector deshabilita lo que falte
  // en vez de fingir que toda categoría soporta los dos modos.
  tieneCatalogo: boolean;
  tieneVisual: boolean;
}

// Las secciones/planogramas vienen del backend con seccion_id tipo
// "lacteos-4b" — la categoría es el prefijo antes del guion.
const CATEGORIA_LABEL_CATALOGO: Record<string, string> = {
  lacteos: 'Lácteos',
  abarrotes: 'Abarrotes secos',
};

function catalogoCategoriaId(seccion: Planograma): string {
  return seccion.seccion_id.split('-')[0];
}

@Component({
  selector: 'app-captura',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './captura.component.html',
  styleUrl: './captura.component.css',
})
export class CapturaComponent {
  private router = inject(Router);
  private vision = inject(VisionService);
  data = inject(OsaDataService);

  @ViewChild('inputArchivo') inputArchivo!: ElementRef<HTMLInputElement>;

  secciones = signal<Planograma[]>([]);
  seccionId = signal<string | null>(null);
  categoriaId = signal<string | null>(null);
  private nombresCategoriasVisuales = signal<Record<string, string>>({});

  categorias = computed<Categoria[]>(() => {
    const catalogoIds = new Set(this.secciones().map(catalogoCategoriaId));
    const visualIds = new Set(Object.keys(this.nombresCategoriasVisuales()));
    const nombresVisuales = this.nombresCategoriasVisuales();

    const lista: Categoria[] = [];
    for (const id of catalogoIds) {
      lista.push({
        id,
        nombre: CATEGORIA_LABEL_CATALOGO[id] ?? nombresVisuales[id] ?? id,
        tieneCatalogo: true,
        tieneVisual: visualIds.has(id),
      });
    }
    for (const id of visualIds) {
      if (!catalogoIds.has(id)) {
        lista.push({ id, nombre: nombresVisuales[id], tieneCatalogo: false, tieneVisual: true });
      }
    }
    return lista;
  });

  categoriaActual = computed(() => this.categorias().find(c => c.id === this.categoriaId()) ?? null);

  seccionesFiltradas = computed(() =>
    this.secciones().filter(s => catalogoCategoriaId(s) === this.categoriaId())
  );

  archivo = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  analizandoReal = signal(false);
  errorReal = signal<string | null>(null);
  resultadoReal = signal<AnalizarImagenResponse | null>(null);

  // ---- Modo "planograma completo real": compara la foto contra la imagen del
  // planograma de referencia de la categoría, en vez de contra un catálogo de SKU ----
  modoVisual = signal(false);
  referenciaUrl = signal<string | null>(null);
  resultadoVisual = signal<AnalizarConReferenciaResponse | null>(null);

  // ---- Causa sugerida por el operador para cada hueco, elegida directo en la
  // tarjeta de resultado (antes de mandarlo al flujo de clasificación) ----
  causaLabel = CAUSA_LABEL;
  catalogoCausas = Object.keys(CAUSA_LABEL) as CausaHueco[];
  causaSeleccionada = signal<Record<string, CausaHueco>>({});

  elegirCausa(id: string, causa: CausaHueco) {
    this.causaSeleccionada.update(m => ({ ...m, [id]: causa }));
  }

  causaDe(id: string): CausaHueco {
    return this.causaSeleccionada()[id] ?? 'sin_rol';
  }

  constructor() {
    forkJoin({
      secciones: this.vision.listarSecciones(),
      categoriasVisuales: this.vision.listarCategoriasVisuales(),
    }).subscribe({
      next: ({ secciones, categoriasVisuales }) => {
        this.secciones.set(secciones);
        this.nombresCategoriasVisuales.set(
          Object.fromEntries(categoriasVisuales.map(c => [c.id, c.nombre]))
        );
        const primera = this.categorias()[0];
        if (primera) {
          this.elegirCategoria(primera.id);
        }
      },
      error: () => this.errorReal.set('No se pudo cargar el catálogo de secciones/planogramas del backend.'),
    });
  }

  elegirCategoria(id: string) {
    this.categoriaId.set(id);
    this.resultadoReal.set(null);
    this.resultadoVisual.set(null);
    this.causaSeleccionada.set({});
    this.errorReal.set(null);

    const cat = this.categoriaActual();
    if (!cat) {
      return;
    }

    const primeraSeccion = this.seccionesFiltradas()[0];
    this.seccionId.set(cat.tieneCatalogo && primeraSeccion ? primeraSeccion.seccion_id : null);

    if (cat.tieneVisual) {
      this.cargarReferenciaVisual(id);
    } else {
      this.limpiarReferenciaVisual();
    }

    // Si la categoría solo soporta un modo, se fija automáticamente — no tiene
    // caso dejar prendido un toggle que no va a poder analizar nada.
    if (!cat.tieneCatalogo && cat.tieneVisual) {
      this.modoVisual.set(true);
    } else if (cat.tieneCatalogo && !cat.tieneVisual) {
      this.modoVisual.set(false);
    }
  }

  private cargarReferenciaVisual(categoriaId: string) {
    this.limpiarReferenciaVisual();
    this.vision.obtenerReferencia(categoriaId).subscribe({
      next: blob => this.referenciaUrl.set(URL.createObjectURL(blob)),
      error: () => this.errorReal.set('No se pudo cargar la imagen de referencia del planograma.'),
    });
  }

  private limpiarReferenciaVisual() {
    const anterior = this.referenciaUrl();
    if (anterior) {
      URL.revokeObjectURL(anterior);
    }
    this.referenciaUrl.set(null);
  }

  abrirSelector() {
    this.inputArchivo.nativeElement.click();
  }

  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.setArchivo(file);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.setArchivo(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  quitarArchivo() {
    this.archivo.set(null);
    this.previewUrl.set(null);
    this.resultadoReal.set(null);
    this.resultadoVisual.set(null);
    this.causaSeleccionada.set({});
    if (this.inputArchivo) {
      this.inputArchivo.nativeElement.value = '';
    }
  }

  toggleModoVisual(activo: boolean) {
    this.modoVisual.set(activo);
    this.resultadoReal.set(null);
    this.resultadoVisual.set(null);
    this.causaSeleccionada.set({});
    this.errorReal.set(null);
  }

  analizar() {
    const archivo = this.archivo();
    if (!archivo) {
      this.errorReal.set('Sube una foto del anaquel antes de analizar.');
      return;
    }

    if (this.modoVisual()) {
      const categoriaId = this.categoriaId();
      if (!categoriaId) {
        this.errorReal.set('Elige una categoría antes de analizar.');
        return;
      }
      this.analizandoReal.set(true);
      this.errorReal.set(null);
      this.resultadoVisual.set(null);
      this.vision.analizarConReferencia(archivo, categoriaId).subscribe({
        next: resp => {
          this.resultadoVisual.set(resp);
          this.analizandoReal.set(false);
        },
        error: err => {
          this.errorReal.set(err?.error?.detail ?? 'Ocurrió un error al analizar la imagen.');
          this.analizandoReal.set(false);
        },
      });
      return;
    }

    const seccionId = this.seccionId();
    if (!seccionId) {
      this.errorReal.set('Elige una sección de anaquel antes de analizar.');
      return;
    }

    this.analizandoReal.set(true);
    this.errorReal.set(null);
    this.resultadoReal.set(null);
    this.vision.analizar(archivo, seccionId).subscribe({
      next: resp => {
        this.resultadoReal.set(resp);
        this.analizandoReal.set(false);
      },
      error: err => {
        this.errorReal.set(err?.error?.detail ?? 'Ocurrió un error al analizar la imagen.');
        this.analizandoReal.set(false);
      },
    });
  }

  continuarConCausas() {
    const preview = this.previewUrl();
    const visual = this.resultadoVisual();
    const catalogo = this.resultadoReal();

    if (visual) {
      this.data.cargarResultadoVision(this.huecosDesdeVisual(visual), preview, visual.resumen);
    } else if (catalogo) {
      this.data.cargarResultadoVision(this.huecosDesdeCatalogo(catalogo), preview, catalogo.resumen);
    } else {
      return;
    }
    this.router.navigate(['/resultado']);
  }

  private huecosDesdeCatalogo(resp: AnalizarImagenResponse): Hueco[] {
    return resp.huecos.map(h => ({
      id: h.posicion_id,
      sku: h.sku,
      producto: h.producto,
      posicion: h.posicion,
      causa: this.causaDe(h.posicion_id),
      causaConfirmada: h.posicion_id in this.causaSeleccionada(),
      detalle:
        `Detectado por visión (${Math.round(h.confianza * 100)}% confianza) · ` +
        `${h.estado === 'vacio' ? 'vacío' : 'parcial'} · ${h.facings_esperados} piezas esperadas. ` +
        'Pendiente cruce de inventario.',
      bodega: 0,
      sistema: 0,
    }));
  }

  private huecosDesdeVisual(resp: AnalizarConReferenciaResponse): Hueco[] {
    return resp.huecos.map(h => ({
      id: h.id,
      sku: '—',
      producto: h.marcas_esperadas,
      posicion: `Nivel ${h.nivel} · ${h.posicion}`,
      causa: this.causaDe(h.id),
      causaConfirmada: h.id in this.causaSeleccionada(),
      detalle:
        `Detectado comparando la foto contra el planograma real de referencia ` +
        `(${h.categoria_esperada}, ${Math.round(h.confianza * 100)}% confianza) · ` +
        `${h.estado === 'vacio' ? 'vacío' : 'parcial'}. Pendiente cruce de inventario.`,
      bodega: 0,
      sistema: 0,
    }));
  }

  private setArchivo(file: File) {
    this.archivo.set(file);
    this.resultadoReal.set(null);
    this.resultadoVisual.set(null);
    this.causaSeleccionada.set({});
    this.errorReal.set(null);
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }
}
