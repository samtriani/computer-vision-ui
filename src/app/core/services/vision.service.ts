import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AnalizarConReferenciaResponse,
  AnalizarImagenResponse,
  CategoriaVisual,
  Planograma,
} from '../models/vision.models';

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

  listarCategoriasVisuales(): Observable<CategoriaVisual[]> {
    return this.http.get<CategoriaVisual[]>(`${environment.apiUrl}/vision/categorias-visuales`);
  }

  // Vía blob (no <img src> directo): el endpoint requiere Bearer token, que el
  // interceptor solo agrega a peticiones hechas con HttpClient.
  obtenerReferencia(categoriaId: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/vision/referencia/${categoriaId}`, { responseType: 'blob' });
  }

  analizarConReferencia(imagenAnaquel: File, categoriaId: string): Observable<AnalizarConReferenciaResponse> {
    const formData = new FormData();
    formData.append('imagen_anaquel', imagenAnaquel);
    formData.append('categoria_id', categoriaId);
    return this.http.post<AnalizarConReferenciaResponse>(
      `${environment.apiUrl}/vision/analizar-con-referencia`,
      formData
    );
  }
}
