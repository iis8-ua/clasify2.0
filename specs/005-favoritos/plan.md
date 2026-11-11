# Implementation Plan: Favoritos

**Branch**: `005-favoritos` | **Date**: 2026-11-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/005-favoritos/spec.md`

## Summary

Implementar el guardado y la consulta de anuncios favoritos. La acción de añadir o quitar se ofrece en el detalle de anuncios ajenos y, además, la lista permite quitar cada favorito con confirmación. La lista de favoritos es una vista propia, paginada, protegida y con tamaño de página configurable. Se apoya en el shell de 001, la sesión de 002, el catálogo de 003 y el estado vendido de 004.

No se muestra el estado de favorito en el listado general y no se incluyen favoritos compartidos, notificaciones, acciones masivas, búsqueda ni filtros. El backend no se modifica.

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

**Storage**:
- Sin persistencia de favoritos en el frontend; los datos viven en la store de Pinia.
- La sesión se lee de la store de 002.
- `sessionVersion` se usa para limpiar favoritos al cerrar sesión.
- La página actual y el tamaño de página se conservan en la URL.

**Testing**: Vitest `3.2.7`, `@vue/test-utils` `2.5.1`, `jsdom` `26.1.0`; validación manual contra el backend real.

**Target Platform**: Aplicación web en navegadores modernos de escritorio y móvil.

**Project Type**: Frontend SPA Vue sobre el backend REST existente.

**Performance Goals**:
- Acción de favorito con feedback perceptible en menos de 1 segundo en condiciones normales.
- Lista de favoritos visible en menos de 2 segundos en entorno local.
- Cambio de página con feedback inmediato.
- Sin desplazamiento horizontal no intencionado a 360 px.

**Constraints**:
- No modificar el backend.
- No permitir favoritos sobre anuncios propios.
- No mostrar la acción de favorito en el listado general.
- Permitir quitar favoritos desde la lista con confirmación y actualización inmediata.
- No incluir favoritos compartidos, notificaciones, acciones masivas, búsqueda, filtros ni ordenación
  personalizada.
- No sincronizar favoritos entre pestañas o dispositivos.
- Tamaño de página configurable entre 10, 20 y 50, con 20 por defecto.
- No añadir comentarios al código.
- No realizar llamadas HTTP directas desde componentes.
- Interfaz en español, accesible y usable a 360 px.

**Scale/Scope**:
- 3 endpoints existentes: añadir, quitar y listar favoritos.
- 1 vista nueva: favoritos.
- 1 acción en el detalle y 1 acción de retirada en cada tarjeta.
- 1 selector de tamaño compartido con el catálogo.
- 1 store y 1 servicio.
- 4 historias de usuario.
- Sin cambios en el backend.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / requisito | Estado | Evidencia |
|---|---|---|
| I. Simplicidad y mantenibilidad | PASS | Se reutilizan el shell, la sesión, el catálogo, las tarjetas y la paginación; no se añaden dependencias. |
| II. Arquitectura y separación de responsabilidades | PASS | Botón, vista, store y servicio mantienen responsabilidades separadas; los componentes no harán HTTP directo. |
| III. Código limpio y sin comentarios | PASS | Las tareas exigirán código autoexplicativo y cero comentarios. |
| IV. Consistencia y convenciones | PASS | Se mantienen PascalCase, camelCase, tarjetas y paginación comunes. |
| V. Seguridad y protección de datos | PASS | Solo el usuario autenticado accede a sus favoritos; el backend comprueba la propiedad; no se muestran favoritos de otras cuentas. |
| VI. Experiencia de usuario y accesibilidad | PASS | Carga, vacío, error, confirmación, teclado, foco, textos alternativos y 360 px. |
| VII. Desarrollo orientado a especificaciones | PASS | El alcance se limita a favoritos; las acciones de catálogo y perfil quedan fuera. |
| VIII. Calidad y verificabilidad | PASS | Vitest cubrirá servicio, store, botón, lista y paginación; el recorrido manual usará el backend real. |
| Tecnología obligatoria | PASS | Vue, Vite, Pinia, Vue Router, PrimeVue y `fetch`; sin cambios en el backend. |
| Gobernanza | PASS | No hay violaciones ni excepciones que justificar. |

**Post-Phase 1 re-check**: PASS. El diseño mantiene la acción en el detalle, añade la retirada controlada desde la lista, comparte el tamaño de página con el catálogo y conserva la limpieza al cerrar sesión.

## Project Structure

### Documentation (this feature)

```text
specs/005-favoritos/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── favoritos-api.md
│   └── favoritos-ui.md
├── checklists/
│   └── requirements.md
└── tasks.md              # Se genera con /speckit.tasks
```

### Source Code (repository root)

```text
frontend-vue/
├── src/
│   ├── components/
│   │   └── favoritos/
│   │       ├── BotonFavorito.vue
│   │       └── BotonQuitarFavorito.vue
│   ├── router/
│   │   └── routes.js
│   ├── services/
│   │   └── favoritosService.js
│   ├── stores/
│   │   └── favoritos.js
│   └── views/
│       └── FavoritosView.vue
└── tests/
    └── favoritos/
        ├── favoritosService.spec.js
        ├── favoritosStore.spec.js
        ├── botonFavorito.spec.js
        ├── botonQuitarFavorito.spec.js
        ├── favoritosView.spec.js
        ├── favoritosListActions.spec.js
        ├── favoritosPageSize.spec.js
        ├── pagination.spec.js
        └── favoritosAccessibility.spec.js
```

**Structure Decision**: se reutiliza `frontend-vue/` y los componentes de catálogo de 003. La ruta `/favoritos` usa la vista real. `BotonFavorito` se monta en el detalle y `BotonQuitarFavorito` en cada tarjeta de la lista. `favoritosStore` mantiene la lista y el estado de las operaciones; `favoritosService` usa la capa HTTP base. La lista reutiliza las tarjetas, el selector de tamaño y la paginación del catálogo.

## Phase 0: Research

Resultado en [research.md](research.md). Decisiones principales:

- Añadir desde el detalle y quitar desde el detalle o desde la tarjeta de la lista.
- La retirada desde la lista pide confirmación, muestra toast y retira la tarjeta.
- Si la página queda vacía, se corrige a la última página disponible.
- Invitación a acceso para visitantes; retorno al anuncio y confirmación manual de la acción.
- Ocultar la acción en anuncios propios.
- Añadir idempotente; quitar un favorito inexistente deja el estado no guardado.
- Lista paginada con 20 por defecto y selector 10/20/50; página y tamaño en la URL.
- Anuncios vendidos visibles con su estado.
- Anuncios eliminados desaparecen al actualizar; detalle directo muestra no encontrado.
- Limpieza de favoritos al cerrar sesión mediante `sessionVersion`.
- Vitest para servicio, store, botones, lista, acciones de retirada, tamaño y paginación.

## Phase 1: Design & Contracts

- [data-model.md](data-model.md): favorito, estado del favorito, lista, paginación, errores y transiciones.
- [contracts/favoritos-api.md](contracts/favoritos-api.md): añadir, quitar, listar y tamaño de página.
- [contracts/favoritos-ui.md](contracts/favoritos-ui.md): botón, retirada desde la tarjeta, lista, tamaño, paginación, permisos, estados y accesibilidad.
- [quickstart.md](quickstart.md): arranque, pruebas y recorrido manual.

## Complexity Tracking

No hay violaciones de la constitución. No se requiere justificar complejidad adicional.
