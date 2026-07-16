import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OsaDataService } from '../../core/services/osa-data.service';

interface Muestra {
  id: number;
  etiqueta: string;
}

@Component({
  selector: 'app-captura',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './captura.component.html',
  styleUrl: './captura.component.css',
})
export class CapturaComponent {
  private router = inject(Router);
  data = inject(OsaDataService);

  muestras: Muestra[] = [
    { id: 0, etiqueta: 'Lácteos 4-B · 7:02 am' },
    { id: 1, etiqueta: 'Lácteos 4-C · 1:14 pm' },
    { id: 2, etiqueta: 'Abarrotes 7-A · 9:40 am' },
  ];

  muestraSeleccionada = 0;

  get analizando() {
    return this.data.analizando();
  }

  elegirMuestra(id: number) {
    this.muestraSeleccionada = id;
  }

  async analizar() {
    await this.data.analizarImagen();
    this.router.navigate(['/resultado']);
  }
}
