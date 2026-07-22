import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OsaDataService } from '../../core/services/osa-data.service';
import { VisionService } from '../../core/services/vision.service';
import { AnalizarImagenResponse, Planograma } from '../../core/models/vision.models';

interface Muestra {
  id: number;
  etiqueta: string;
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

  muestras: Muestra[] = [
    { id: 0, etiqueta: 'Lácteos 4-B · 7:02 am' },
    { id: 1, etiqueta: 'Lácteos 4-C · 1:14 pm' },
    { id: 2, etiqueta: 'Abarrotes 7-A · 9:40 am' },
  ];

  muestraSeleccionada: number | null = 0;

  secciones = signal<Planograma[]>([]);
  seccionId = signal<string | null>(null);

  archivo = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  analizandoReal = signal(false);
  errorReal = signal<string | null>(null);
  resultadoReal = signal<AnalizarImagenResponse | null>(null);

  constructor() {
    this.vision.listarSecciones().subscribe({
      next: secciones => {
        this.secciones.set(secciones);
        if (secciones.length) {
          this.seccionId.set(secciones[0].seccion_id);
        }
      },
      error: () => this.errorReal.set('No se pudo cargar el catálogo de secciones/planogramas del backend.'),
    });
  }

  get analizando() {
    return this.data.analizando();
  }

  elegirMuestra(id: number) {
    this.muestraSeleccionada = id;
    this.archivo.set(null);
    this.previewUrl.set(null);
    this.resultadoReal.set(null);
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
    if (this.inputArchivo) {
      this.inputArchivo.nativeElement.value = '';
    }
  }

  async analizar() {
    const archivo = this.archivo();
    const seccionId = this.seccionId();

    if (archivo && !seccionId) {
      this.errorReal.set('Elige una sección de anaquel antes de analizar.');
      return;
    }

    if (archivo && seccionId) {
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
      return;
    }

    // Sin imagen real: demo con la muestra dummy seleccionada
    await this.data.analizarImagen();
    this.router.navigate(['/resultado']);
  }

  private setArchivo(file: File) {
    this.archivo.set(file);
    this.muestraSeleccionada = null;
    this.resultadoReal.set(null);
    this.errorReal.set(null);
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }
}
