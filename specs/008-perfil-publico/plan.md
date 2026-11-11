# Implementation Plan: Perfil público

**Branch**: `008-perfil-publico` | **Date**: 2026-11-11 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/008-perfil-publico/spec.md`

## Summary

Implementar el perfil público de otros usuarios: datos públicos, valoraciones recibidas de solo lectura y anuncios publicados, incluidos los vendidos. La vista es pública, enlaza desde el detalle, la mensajería y las valoraciones, y usa paginación con tamaño 10/20/50.

La feature se apoya en el shell y el tema de 001, la sesión de 002, las tarjetas y la paginación de 003, y los endpoints existentes de perfil público, anuncios por usuario y valoraciones. La escritura de valoraciones corresponde a 009. El backend no se modifica.

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
- Sin persistencia local de perfiles, valoraciones o anuncios.
- Los datos viven en la store de perfil público.
- La sesión se lee de la store de 002 para el enlace propio y el contexto de valoración.
- Página y tamaño de cada listado se conservan en la URL.
- La preferencia de tema se lee de 001.

**Testing**: Vitest `3.2.7`, `@vue/test-utils` `2.5.1`, `jsdom` `26.1.0`; validación manual contra el backend real.

**Target Platform**: Aplicación web en navegadores modernos de escritorio y móvil.

**Project Type**: Frontend SPA Vue sobre el backend REST existente.

**Performance Goals**:
- Perfil público visible en menos de 2 segundos en entorno local.
- Cambio de página o tamaño con feedback inmediato.
- Sin desplazamiento horizontal no intencionado a 360 px.

**Constraints**:
- No modificar el backend.
- La ruta es pública; las acciones de valoración se especifican en 009.
- No mostrar email ni datos privados.
- No ofrecer edición, avatar, seguimiento ni gestión de anuncios.
- No añadir comentarios al código.
- No realizar llamadas HTTP directas desde componentes.
- Interfaz en español, accesible y usable a 360 px.

**Scale/Scope**:
- 3 endpoints existentes: perfil público, anuncios por usuario y valoraciones recibidas.
- 1 vista nueva: perfil público.
- 1 store: `perfilPublico`.
- 1 servicio: `perfilPublicoService`.
- 4 historias de usuario.
- Sin cambios en el backend.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / requisito | Estado | Evidencia |
|---|---|---|
| I. Simplicidad y mantenibilidad | PASS | Se reutilizan shell, tema, tarjetas, paginación, tamaño y estados; no se añaden dependencias. |
| II. Arquitectura y separación de responsabilidades | PASS | Vista, componentes, store y servicio separan presentación, estado y HTTP. |
| III. Código limpio y sin comentarios | PASS | Las tareas exigirán código autoexplicativo y cero comentarios. |
| IV. Consistencia y convenciones | PASS | Se mantienen PascalCase, camelCase, nombres del backend y componentes compartidos. |
| V. Seguridad y protección de datos | PASS | Solo se muestran datos públicos; el email queda fuera; la vista es de solo lectura. |
| VI. Experiencia de usuario y accesibilidad | PASS | Carga, vacío, error, teclado, foco, contraste en ambos temas y 360 px. |
| VII. Desarrollo orientado a especificaciones | PASS | El alcance se limita a 008; las acciones de valoración quedan en 009. |
| VIII. Calidad y verificabilidad | PASS | Vitest cubrirá servicio, store, datos, valoraciones, anuncios, tamaño y accesibilidad. |
| Tecnología obligatoria | PASS | Vue, Vite, Pinia, Vue Router, PrimeVue y `fetch`; sin cambios en el backend. |
| Gobernanza | PASS | No hay violaciones ni excepciones que justificar. |

**Post-Phase 1 re-check**: PASS. El diseño mantiene la vista pública de solo lectura, sin email ni acciones privadas, y deja la escritura de valoraciones a 009.

## Project Structure

### Documentation (this feature)

```text
specs/008-perfil-publico/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── perfil-publico-api.md
│   └── perfil-publico-ui.md
├── checklists/
│   └── requirements.md
└── tasks.md              # Se genera con /speckit.tasks
```

### Source Code (repository root)

```text
frontend-vue/
├── src/
│   ├── components/
│   │   └── perfil-publico/
│   │       ├── PerfilPublicoDatos.vue
│   │       ├── ValoracionesRecibidas.vue
│   │       └── AnunciosUsuario.vue
│   ├── router/
│   │   └── routes.js
│   ├── services/
│   │   └── perfilPublicoService.js
│   ├── stores/
│   │   └── perfilPublico.js
│   └── views/
│       └── PerfilPublicoView.vue
└── tests/
    └── perfil-publico/
        ├── perfilPublicoService.spec.js
        ├── perfilPublicoStore.spec.js
        ├── perfilPublicoView.spec.js
        ├── valoracionesRecibidas.spec.js
        ├── anunciosUsuario.spec.js
        ├── perfilPublicoPageSize.spec.js
        ├── perfilPublicoLinks.spec.js
        └── perfilPublicoAccessibility.spec.js
```

**Structure Decision**: se reutiliza `frontend-vue/` y los componentes de tarjeta, paginación, tamaño y estados de 001–003. `PerfilPublicoView` coordina datos, valoraciones y anuncios. `perfilPublicoStore` mantiene los tres recursos por usuario; `perfilPublicoService` usa la capa HTTP base. Las listas usan parámetros de URL independientes: `paginaAnuncios`, `limiteAnuncios`, `paginaValoraciones` y `limiteValoraciones`.

## Phase 0: Research

Resultado en [research.md](research.md). Decisiones principales:

- Ruta pública `/usuarios/:id`, accesible sin sesión.
- Datos públicos sin email ni password.
- Valoraciones recibidas de solo lectura en 008; la escritura queda en 009.
- Anuncios publicados paginados, incluidos vendidos.
- Enlaces desde autor, contraparte, autor de valoración y perfil propio.
- Página y tamaño independientes para anuncios y valoraciones.
- Tamaño 10/20/50 con 20 por defecto.
- Errores 404, red y estados vacíos.
- Vitest para servicio, store, vista, listados, tamaño, enlaces y accesibilidad.

## Phase 1: Design & Contracts

- [data-model.md](data-model.md): perfil público, resumen, valoración recibida, anuncios y paginación.
- [contracts/perfil-publico-api.md](contracts/perfil-publico-api.md): perfil, anuncios y valoraciones.
- [contracts/perfil-publico-ui.md](contracts/perfil-publico-ui.md): ruta, secciones, query, enlaces, estados y accesibilidad.
- [quickstart.md](quickstart.md): arranque, pruebas y recorrido manual con los usuarios del seed.

## Complexity Tracking

No hay violaciones de la constitución. No se requiere justificar complejidad adicional.
