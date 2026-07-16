import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsaDataService } from '../../core/services/osa-data.service';
import { CAUSA_LABEL, CAUSA_RESPONSABLE, RESPONSABLE_COLOR, RESPONSABLE_LABEL } from '../../core/models/osa.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  data = inject(OsaDataService);
  causaLabel = CAUSA_LABEL;
  causaResponsable = CAUSA_RESPONSABLE;
  responsableColor = RESPONSABLE_COLOR;
  responsableLabel = RESPONSABLE_LABEL;
  responsables = Object.keys(RESPONSABLE_LABEL) as (keyof typeof RESPONSABLE_LABEL)[];

  cumplimientoClase(pct: number): string {
    if (pct >= 85) return '';
    if (pct >= 65) return 'medio';
    return 'bajo';
  }

  claseBarra(osa: number): string {
    if (osa >= 92) return '';
    if (osa >= 85) return 'medio';
    return 'bajo';
  }

  semaforo(osa: number): string {
    if (osa >= 92) return 's-ok';
    if (osa >= 85) return 's-warn';
    return 's-bad';
  }

  maxOsa(): number {
    return Math.max(...this.data.serieHoraria.map(p => p.osa));
  }
}
