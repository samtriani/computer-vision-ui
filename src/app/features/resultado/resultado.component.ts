import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsaDataService } from '../../core/services/osa-data.service';
import { CAUSA_CLASE, CAUSA_LABEL } from '../../core/models/osa.models';

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

  get huecos() {
    return this.data.huecos();
  }

  huecoSeleccionado: string | null = null;

  verHueco(id: string) {
    this.huecoSeleccionado = id;
    setTimeout(() => (this.huecoSeleccionado = null), 1600);
    const el = document.getElementById('hueco-' + id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  generarTareas() {
    alert('Demo: aquí se generarían ' + this.huecos.length + ' tareas de acción para el rol Operativo.');
  }
}
