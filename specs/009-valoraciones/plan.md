# Implementation Plan: Valoraciones

**Branch**: `009-valoraciones` | **Date**: 2026-11-11 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/009-valoraciones/spec.md`

## Summary

Implementar la gestión de valoraciones entre usuarios: crear o actualizar una valoración desde el perfil público, eliminarla con confirmación y consultar las valoraciones recibidas y escritas en el perfil propio. La feature se apoya en el shell y el tema de 001, la sesión de 002, el perfil público de 008 y el perfil propio de 006.

La puntuación es obligatoria de 1 a 5 y el comentario opcional de hasta 500 caracteres. Nadie puede valorarse a sí mismo. El backend no se modifica.

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
- Sin persistencia local de valoraciones.
- Las listas y operaciones viven en la store de valoraciones.
- La sesión se lee de la store de 002.
- Las páginas y tamaños de las listas del perfil propio se conservan en la URL.
- La preferencia de tema se lee de 001.

**Testing**: Vitest `3.2.7`, `@vue/test-utils` `2.5.1`, `jsdom` `26.1.0`; validación manual contra el backend real.

**Target Platform**: Aplicación web en navegadores modernos de escritorio y móvil.

**Project Type**: Frontend SPA Vue sobre el backend REST existente.

**Performance Goals**:
- Formulario de valoración con feedback inmediato.
- Guardado o eliminación con confirmación perceptible en menos de 1 segundo en condiciones normales.
- Listados con respuesta inmediata al cambiar de página o tamaño.
- Sin desplazamiento horizontal no intencionado a 360 px.

**Constraints**:
- No modificar el backend.
- Puntuación entera 1–5; comentario opcional de hasta 500 caracteres.
- No valorarse a sí mismo.
- No incluir moderación, respuestas, votos de utilidad ni valoraciones anónimas.
- No añadir comentarios al código.
- No realizar llamadas HTTP directas desde componentes.
- Interfaz en español, accesible y usable a 360 px.

**Scale/Scope**:
- 4 endpoints existentes: listar recibidas, listar escritas, guardar y eliminar.
- 1 formulario en perfil público.
- 2 listados en perfil propio.
- 1 store: `valoraciones`.
- 1 servicio: `valoracionesService`.
- 4 historias de usuario.
- Sin cambios en el backend.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / requisito | Estado | Evidencia |
|---|---|---|
| I. Simplicidad y mantenibilidad | PASS | Se reutilizan shell, tema, estados, confirmaciones y paginación; no se añaden dependencias. |
| II. Arquitectura y separación de responsabilidades | PASS | Componentes de valoración, store y servicio separan presentación, estado y HTTP. |
| III. Código limpio y sin comentarios | PASS | Las tareas exigirán código autoexplicativo y cero comentarios. |
| IV. Consistencia y convenciones | PASS | Se mantienen PascalCase, camelCase, nombres del backend y componentes compartidos. |
| V. Seguridad y protección de datos | PASS | Solo el usuario autenticado valora; no puede valorarse a sí mismo; el backend comprueba la identidad. |
| VI. Experiencia de usuario y accesibilidad | PASS | Validación por campo, foco, confirmación de borrado, teclado, contraste y 360 px. |
| VII. Desarrollo orientado a especificaciones | PASS | El alcance se limita a 009; la vista pública de solo lectura queda en 008. |
| VIII. Calidad y verificabilidad | PASS | Vitest cubrirá servicio, store, formulario, listados, permisos y accesibilidad. |
| Tecnología obligatoria | PASS | Vue, Vite, Pinia, Vue Router, PrimeVue y `fetch`; sin cambios en el backend. |
| Gobernanza | PASS | No hay violaciones ni excepciones que justificar. |

**Post-Phase 1 re-check**: PASS. El diseño mantiene la validación en backend y frontend, la confirmación de borrado y la separación entre lectura pública y escritura autenticada.

## Project Structure

### Documentation (this feature)

```text
specs/009-valoraciones/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── valoraciones-api.md
│   └── valoraciones-ui.md
├── checklists/
│   └── requirements.md
└── tasks.md              # Se genera con /speckit.tasks
```

### Source Code (repository root)

```text
frontend-vue/
├── src/
│   ├── components/
│   │   └── valoraciones/
│   │       ├── FormularioValoracion.vue
│   │       ├── ListaValoraciones.vue
│   │       ├── ValoracionItem.vue
│   │       └── MisValoracionesSection.vue
│   ├── services/
│   │   └── valoracionesService.js
│   ├── stores/
│   │   └── valoraciones.js
│   └── views/
│       ├── PerfilPublicoView.vue
│       └── PerfilView.vue
└── tests/
    └── valoraciones/
        ├── valoracionesService.spec.js
        ├── valoracionesStore.spec.js
        ├── formularioValoracion.spec.js
        ├── valoracionesRecibidas.spec.js
        ├── valoracionesEscritas.spec.js
        ├── eliminarValoracion.spec.js
        ├── valoracionesPageSize.spec.js
        └── valoracionesAccessibility.spec.js
```

**Structure Decision**: se reutiliza `frontend-vue/`, el perfil público de 008 y el perfil propio de 006. `FormularioValoracion` se monta solo en `PerfilPublicoView`; `MisValoracionesSection` muestra recibidas y escritas en `PerfilView`. `valoracionesStore` mantiene listas y operaciones; `valoracionesService` usa la capa HTTP base. Las listas del perfil propio usan `valoracionesRecibidasPagina`, `valoracionesRecibidasLimite`, `valoracionesEscritasPagina` y `valoracionesEscritasLimite`.

## Phase 0: Research

Resultado en [research.md](research.md). Decisiones principales:

- Formulario solo en perfil público de otro usuario.
- Puntuación entera 1–5 y comentario opcional de 500 caracteres.
- `PUT` idempotente: crea o actualiza sin duplicados.
- Eliminar con confirmación; `404` converge a sin valoración.
- Cualquier usuario autenticado puede valorar a otro, nunca a sí mismo.
- Perfil propio con valoraciones recibidas y escritas.
- Editar una valoración escrita abre el perfil público del destinatario con el formulario precargado.
- Página y tamaño independientes para recibidas y escritas.
- Vitest para servicio, store, formulario, listados, borrado, tamaño y accesibilidad.

## Phase 1: Design & Contracts

- [data-model.md](data-model.md): valoración, resumen, listas, errores y transiciones.
- [contracts/valoraciones-api.md](contracts/valoraciones-api.md): listar, guardar y eliminar.
- [contracts/valoraciones-ui.md](contracts/valoraciones-ui.md): formulario, listas, confirmación, query, permisos y accesibilidad.
- [quickstart.md](quickstart.md): arranque, pruebas y recorrido manual con los usuarios del seed.

## Complexity Tracking

No hay violaciones de la constitución. No se requiere justificar complejidad adicional.
