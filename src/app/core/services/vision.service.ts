import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AnalizarImagenResponse, Planograma } from '../models/vision.models';

@Injectable({ providedIn: 'root' })
export class VisionService {
  private http = inject(HttpClient);

  listarSecciones(): Observable<Planograma[]> {
    return this.http.get<Planograma[]>(`${environment.apiUrl}/vision/secciones`);
  }

  analizar(imagen: File, seccionId: string): Observable<AnalizarImagenResponse> {
    const formData = new FormData();
    formData.append('imagen', imagen);
    formData.append('seccion_id', seccionId);
    return this.http.post<AnalizarImagenResponse>(`${environment.apiUrl}/vision/analizar`, formData);
  }
}
