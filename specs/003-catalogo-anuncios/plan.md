# Implementation Plan: Catálogo de anuncios

**Branch**: `003-catalogo-anuncios` | **Date**: 2026-11-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-catalogo-anuncios/spec.md`

## Summary

Implementar el catálogo público de anuncios: listado paginado, detalle, búsqueda por texto, filtros por categoría y estado, ordenación y estados de interfaz. La feature se apoya en la estructura común y la capa HTTP de `001-app-shell`, y en la sesión de `002-autenticacion-sesion` para mostrar el estado de favorito del detalle de forma informativa.

El listado usa un tamaño fijo de 20, conserva página y filtros en la dirección y carga el catálogo real de categorías para mostrar nombres y alimentar el filtro. No implementa creación, edición, eliminación, cambio de estado ni acciones de favoritos. El backend no se modifica.

## Technical Context

**Language/Version**: JavaScript ES2022; Vue `3.5.45`; Node.js `^20.19.0 || >=22.12.0`

**Primary Dependencies**:
- Vue `3.5.45`
- Vite `7.3.8`
- `@vitejs/plugin-vue` `6.0.10`
- Pinia `3.0.4`
- Vue Router `4.6.4`
- PrimeVue `4.5.5`
- `@primeuix/themes` `1.2.5`
- `primeicons` `7.0.0`
- `fetch` nativo; sin axios

**Storage**: Sin datos de catálogo persistidos. La página y los filtros del listado se reflejan en la URL. La sesión se lee de la store de `002` para el estado informativo de favorito. No se usa `localStorage`.

**Testing**: Vitest `3.2.7`, `@vue/test-utils` `2.5.1`, `jsdom` `26.1.0`; validación manual contra el backend real con los datos del seed.

**Target Platform**: Aplicación web en navegadores modernos de escritorio y móvil.

**Project Type**: Frontend SPA Vue sobre el backend REST existente.

**Performance Goals**:
- Primera página del catálogo visible en menos de 2 segundos en entorno local.
- Cambio de página o filtro con feedback perceptible en menos de 1 segundo en condiciones normales.
- Imágenes del listado con carga diferida y sin bloquear la interacción.
- Sin desplazamiento horizontal no intencionado a 360 px.

**Constraints**:
- No modificar el backend.
- No implementar creación, edición, eliminación, cambio de estado ni acciones de favoritos.
- No añadir búsqueda en otros recursos, historial de búsquedas, sugerencias, filtros de precio, mapa,
  recomendaciones ni búsquedas guardadas.
- No usar paginación infinita ni selector de tamaño de página.
- Tamaño de página fijo en 20.
- No añadir comentarios al código.
- No realizar llamadas HTTP directas desde componentes.
- Interfaz en español, accesible y usable a 360 px.
- El estado de favorito del detalle es informativo; no se añade ni se quita.

**Scale/Scope**:
- 3 endpoints existentes: listado, detalle y categorías.
- 2 vistas: listado y detalle.
- 2 stores: anuncios y categorías.
- 2 servicios: anuncios y categorías.
- 5 historias de usuario.
- 24 anuncios de ejemplo, 2 vendidos y 2 páginas con el límite por defecto.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / requisito | Estado | Evidencia |
|---|---|---|
| I. Simplicidad y mantenibilidad | PASS | Se reutilizan el shell, la capa HTTP y los componentes comunes; no se añaden dependencias ni recursos fuera del catálogo. |
| II. Arquitectura y separación de responsabilidades | PASS | Vistas, componentes de catálogo, stores y servicios mantienen responsabilidades separadas; los componentes no harán HTTP directo. |
| III. Código limpio y sin comentarios | PASS | Las tareas exigirán código autoexplicativo y cero comentarios. |
| IV. Consistencia y convenciones | PASS | Se mantienen PascalCase para componentes, camelCase para JavaScript y los nombres de campo del backend. |
| V. Seguridad y protección de datos | PASS | El catálogo es público; no se exponen emails; el estado de favorito es informativo y la autorización real sigue en el backend. |
| VI. Experiencia de usuario y accesibilidad | PASS | Carga, vacío, error, reintento, paginación, teclado, foco, textos alternativos y 360 px. |
| VII. Desarrollo orientado a especificaciones | PASS | El alcance se limita al catálogo; la gestión y los favoritos quedan para otras specs. |
| VIII. Calidad y verificabilidad | PASS | Vitest cubrirá servicios, stores y componentes; el recorrido manual usará el backend real. |
| Tecnología obligatoria | PASS | Vue, Vite, Pinia, Vue Router, PrimeVue y `fetch`; sin cambios en el backend. |
| Gobernanza | PASS | No hay violaciones ni excepciones que justificar. |

**Post-Phase 1 re-check**: PASS. El diseño mantiene el catálogo público, el tamaño fijo de página y la separación entre datos y presentación, sin invadir la gestión ni los favoritos.

## Project Structure

### Documentation (this feature)

```text
specs/003-catalogo-anuncios/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── catalog-api.md
│   └── catalog-ui.md
├── checklists/
│   └── requirements.md
└── tasks.md              # Se genera con /speckit.tasks
```

### Source Code (repository root)

```text
frontend-vue/
├── src/
│   ├── components/
│   │   ├── catalog/
│   │   │   ├── AnuncioCard.vue
│   │   │   ├── AnuncioGrid.vue
│   │   │   ├── FiltrosCatalogo.vue
│   │   │   ├── PaginacionCatalogo.vue
│   │   │   ├── SelectorCategoria.vue
│   │   │   └── EstadoAnuncioBadge.vue
│   │   └── common/
│   │       ├── DateText.vue
│   │       ├── ImageWithFallback.vue
│   │       └── PriceText.vue
│   ├── router/
│   │   ├── catalogQuery.js
│   │   └── routes.js
│   ├── services/
│   │   ├── anunciosService.js
│   │   └── categoriasService.js
│   ├── stores/
│   │   ├── anuncios.js
│   │   └── categorias.js
│   └── views/
│       ├── AnunciosListView.vue
│       └── AnuncioDetalleView.vue
└── tests/
    └── catalog/
        ├── anunciosService.spec.js
        ├── categoriasService.spec.js
        ├── anunciosStore.spec.js
        ├── catalogQuery.spec.js
        ├── catalogList.spec.js
        ├── catalogDetail.spec.js
        ├── catalogFilters.spec.js
        ├── catalogAccessibility.spec.js
        ├── catalogLongSearch.spec.js
        └── pagination.spec.js
```

**Structure Decision**: se reutiliza `frontend-vue/` y los componentes comunes de 001. Las rutas `/` y `/anuncios/:id` sustituyen sus placeholders. Las stores `anuncios` y `categorias` encapsulan listado, detalle y catálogo; los servicios usan la capa HTTP base. La sincronización de la URL se aísla en `router/catalogQuery.js`.

## Phase 0: Research

Resultado en [research.md](research.md). Decisiones principales:

- Parámetros de URL: `texto`, `categoria`, `estado`, `orden` y `pagina`; `limite` fijo en 20.
- Búsqueda por texto al enviar o pulsar Enter; filtros de categoría, estado y orden al cambiar.
- Cambio de filtro vuelve a página 1; cambio de página conserva filtros.
- Categorías cargadas una vez con `limite=100`; si hay más páginas, se recorren.
- Página fuera de rango redirige a la última página disponible.
- Estado de favorito del detalle solo informativo.
- Sin nombre de autor en el listado.
- Imágenes del listado con carga diferida y marcador accesible.
- Vitest para servicios, stores, query y componentes clave.

## Phase 1: Design & Contracts

- [data-model.md](data-model.md): anuncio resumido, detalle, autor, categoría, paginación, filtros y estados.
- [contracts/catalog-api.md](contracts/catalog-api.md): listado, detalle y categorías.
- [contracts/catalog-ui.md](contracts/catalog-ui.md): query de URL, tarjetas, detalle, paginación, estados y accesibilidad.
- [quickstart.md](quickstart.md): arranque, pruebas y recorrido manual con los datos del seed.

## Complexity Tracking

No hay violaciones de la constitución. No se requiere justificar complejidad adicional.
