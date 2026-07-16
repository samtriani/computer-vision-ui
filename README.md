# OSA Vision — PoC La Comer

Prototipo Angular con datos dummy para la PoC de detección de faltantes de anaquel (OSA) — proyecto EY / La Comer.

## Cómo correrlo

```bash
npm install
npm start
```

Abre http://localhost:4200

## Selector de rol

En la barra superior puedes cambiar entre 3 roles, cada uno ve solo las vistas que le corresponden:

- **Operativo** (reponedor de piso): solo Captura
- **Tienda** (gerente de tienda): Captura + Análisis + Dashboard
- **Ejecutivo** (direcciones): solo Dashboard OSA global

## Estructura

```
src/app/
  core/
    models/osa.models.ts        → tipos de dominio (Hueco, Tienda, etc.)
    services/rol.service.ts     → rol activo (signal reactivo)
    services/osa-data.service.ts→ datos dummy — AQUÍ se conecta el FastAPI real
  shared/components/topbar/     → navegación + selector de rol
  features/
    captura/                    → Bloque 1: subir/seleccionar imagen de anaquel
    resultado/                  → Bloque 1+2: anaquel con huecos + causa clasificada
    dashboard/                  → vista ejecutiva OSA + comparación contra el F9 (AS-IS)
```

## Taxonomía de causas (F9)

La clasificación de causas (`CausaHueco` en `osa.models.ts`) usa las **10 causas reales**
del reporte semanal F9 (Análisis de Desabasto) de La Comer, no una lista inventada —
ver el detalle de cada causa, su responsable inferido y las preguntas pendientes de
confirmar con el dueño del reporte en la memoria del proyecto `f9-desabasto-report`.

El Dashboard incluye además el pivot **Formato / Subdirector** y el % de
**cumplimiento** por tienda, tal como existen en el archivo F9 original — para
argumentar visualmente por qué la medición continua por visión (esta PoC) mejora
sobre el escaneo manual de una vez al día que hace el F9 hoy.

Todos los valores de causas, formato/subdirector y cumplimiento son **dummy**:
respetan la estructura real del F9 pero no vienen de datos confirmados por el
dueño del reporte.

## Siguiente paso técnico

Reemplazar `OsaDataService` (datos hardcoded) por llamadas HTTP al backend FastAPI:
- `POST /api/v1/vision/analizar`
- `POST /api/v1/inventario/cruzar`
- `GET  /api/v1/osa/dashboard`

Sin tocar los componentes — solo el servicio.
