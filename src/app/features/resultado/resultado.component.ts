import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsaDataService } from '../../core/services/osa-data.service';
import { CAUSA_CLASE, CAUSA_LABEL, CausaHueco, Hueco } from '../../core/models/osa.models';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultado.component.html',
  styleUrl: './resultado.component.css',
})
export class ResultadoComponent {
  data = inject(OsaDataService);
  causaLabel = CAUSA_LABEL;
  causaClase = CAUSA_CLASE;
  catalogoCausas = Object.keys(CAUSA_LABEL) as CausaHueco[];

  get huecos() {
    return this.data.huecos();
  }

  get origen() {
    return this.data.origenResultado();
  }

  get imagenAnaquelUrl() {
    return this.data.imagenAnaquelUrl();
  }

  get resumenVision() {
    return this.data.resumenVision();
  }

  huecoSeleccionado: string | null = null;
  editandoCausa: string | null = null;

  verHueco(id: string) {
    this.huecoSeleccionado = id;
    setTimeout(() => (this.huecoSeleccionado = null), 1600);
    const el = document.getElementById('hueco-' + id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  toggleCatalogo(id: string) {
    this.editandoCausa = this.editandoCausa === id ? null : id;
  }

  elegirCausa(h: Hueco, causa: CausaHueco) {
    this.data.actualizarCausa(h.id, causa);
    this.editandoCausa = null;
  }

  confirmarSugerida(h: Hueco, evento: Event) {
    evento.stopPropagation();
    this.data.confirmarCausa(h.id);
  }

  generarTareas() {
    alert('Demo: aquí se generarían ' + this.huecos.length + ' tareas de acción para el rol Operativo.');
  }
}
