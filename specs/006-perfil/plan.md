# Implementation Plan: Perfil propio

**Branch**: `006-perfil` | **Date**: 2026-11-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-perfil/spec.md`

## Summary

Implementar la vista de perfil propio: consulta de datos, edición de nombre y biografía, cambio de contraseña con la contraseña actual, enlace al perfil público propio y listado paginado de anuncios propios. La feature se apoya en el shell de 001, la sesión de 002, el catálogo de 003, la gestión de 004 y el perfil público de 008.

El email es informativo y no editable. La lista de anuncios propios conserva página y tamaño en la dirección, usa 20 elementos por página por defecto, permite 10, 20 o 50 y solo abre el detalle; las acciones de gestión se realizan desde el detalle. El estado vacío ofrece una acción para crear un anuncio. El backend no se modifica.

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
- Sin persistencia de perfil ni formularios.
- El usuario actualizado se refleja en la store de sesión de 002.
- La página y el tamaño de página de anuncios propios se conservan en la URL.
- La lista se limpia al cerrar sesión mediante `sessionVersion`.

**Testing**: Vitest `3.2.7`, `@vue/test-utils` `2.5.1`, `jsdom` `26.1.0`; validación manual contra el backend real.

**Target Platform**: Aplicación web en navegadores modernos de escritorio y móvil.

**Project Type**: Frontend SPA Vue sobre el backend REST existente.

**Performance Goals**:
- Perfil visible en menos de 2 segundos en entorno local.
- Guardado de datos o contraseña con feedback en menos de 1 segundo en condiciones normales.
- Lista de anuncios propios con respuesta inmediata al cambiar de página.
- Sin desplazamiento horizontal no intencionado a 360 px.

**Constraints**:
- No modificar el backend.
- No permitir cambiar el email.
- Enlazar al perfil público propio según 008; no implementar aquí la vista pública, el avatar, la
  eliminación de cuenta, la recuperación de contraseña, la verificación de email, la autenticación en
  dos pasos, la mensajería ni la gestión de valoraciones.
- No incluir búsqueda, filtros ni ordenación personalizada de anuncios propios.
- Tamaño de página configurable entre 10, 20 y 50, con 20 por defecto.
- No ofrecer acciones de gestión en la lista de anuncios propios; solo abrir el detalle.
- No añadir comentarios al código.
- No realizar llamadas HTTP directas desde componentes.
- Interfaz en español, accesible y usable a 360 px.

**Scale/Scope**:
- 4 endpoints existentes: perfil propio, edición de perfil, anuncios propios y perfil público.
- 1 vista nueva: perfil.
- 1 enlace al perfil público propio.
- 1 selector de tamaño compartido con el catálogo.
- 1 store y 1 servicio.
- 5 historias de usuario.
- Sin cambios en el backend.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / requisito | Estado | Evidencia |
|---|---|---|
| I. Simplicidad y mantenibilidad | PASS | Se reutilizan el shell, la sesión, las tarjetas y la paginación; no se añaden dependencias. |
| II. Arquitectura y separación de responsabilidades | PASS | Vista, componentes de perfil, store y servicio mantienen responsabilidades separadas; los componentes no harán HTTP directo. |
| III. Código limpio y sin comentarios | PASS | Las tareas exigirán código autoexplicativo y cero comentarios. |
| IV. Consistencia y convenciones | PASS | Se mantienen PascalCase, camelCase y los nombres de campo del backend. |
| V. Seguridad y protección de datos | PASS | Solo el propio usuario accede; email no editable; contraseña actual requerida; contraseña no visible; autorización real en backend. |
| VI. Experiencia de usuario y accesibilidad | PASS | Carga, errores por campo, confirmaciones, teclado, foco, textos alternativos y 360 px. |
| VII. Desarrollo orientado a especificaciones | PASS | El alcance se limita al perfil propio y a su enlace público; la vista pública se especifica en 008 y las valoraciones en 009. |
| VIII. Calidad y verificabilidad | PASS | Vitest cubrirá servicio, store, formularios y lista; el recorrido manual usará el backend real. |
| Tecnología obligatoria | PASS | Vue, Vite, Pinia, Vue Router, PrimeVue y `fetch`; sin cambios en el backend. |
| Gobernanza | PASS | No hay violaciones ni excepciones que justificar. |

**Post-Phase 1 re-check**: PASS. El diseño mantiene el email inmutable, la contraseña actual obligatoria, las acciones de gestión en el detalle, el enlace al perfil público y la limpieza al cerrar sesión.

## Project Structure

### Documentation (this feature)

```text
specs/006-perfil/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── perfil-api.md
│   └── perfil-ui.md
├── checklists/
│   └── requirements.md
└── tasks.md              # Se genera con /speckit.tasks
```

### Source Code (repository root)

```text
frontend-vue/
├── src/
│   ├── components/
│   │   └── perfil/
│   │       ├── PerfilDatos.vue
│   │       ├── PerfilForm.vue
│   │       ├── CambioContrasenaForm.vue
│   │       └── MisAnunciosSection.vue
│   ├── router/
│   │   └── routes.js
│   ├── services/
│   │   └── usuariosService.js
│   ├── stores/
│   │   └── perfil.js
│   └── views/
│       └── PerfilView.vue
└── tests/
    └── perfil/
        ├── usuariosService.spec.js
        ├── perfilStore.spec.js
        ├── perfilForm.spec.js
        ├── cambioContrasena.spec.js
        ├── misAnuncios.spec.js
        ├── perfilPageSize.spec.js
        ├── perfilPublicProfileLink.spec.js
        ├── perfilAccessibility.spec.js
        └── pagination.spec.js
```

**Structure Decision**: se reutiliza `frontend-vue/` y los componentes de tarjeta, paginación, tamaño y estados de 001–003. La ruta `/perfil` usa la vista real. `PerfilView` coordina datos, edición, contraseña, enlace al perfil público y anuncios propios. `perfilStore` mantiene perfil y lista; `usuariosService` usa la capa HTTP base. La acción de creación del estado vacío reutiliza la ruta de 004.

## Phase 0: Research

Resultado en [research.md](research.md). Decisiones principales:

- Perfil propio y email informativo; enlace al perfil público propio especificado en 008.
- Edición de nombre y biografía separada del cambio de contraseña.
- Contraseña actual obligatoria; contraseña nueva de al menos 8 caracteres.
- Contraseña actual incorrecta: error de formulario, sin cerrar sesión.
- Actualización del usuario en la store de sesión y en la cabecera.
- Lista de anuncios propios paginada con 20 por defecto, selector 10/20/50, página y tamaño en la URL.
- Anuncios vendidos visibles; acciones de gestión solo en el detalle.
- Estado vacío con acción para crear anuncio.
- Limpieza de perfil al cerrar sesión mediante `sessionVersion`.
- Vitest para servicio, store, formularios, enlace público, tamaño y lista.

## Phase 1: Design & Contracts

- [data-model.md](data-model.md): perfil, formularios, lista de anuncios propios, paginación y errores.
- [contracts/perfil-api.md](contracts/perfil-api.md): perfil, edición, anuncios propios y enlace al perfil público.
- [contracts/perfil-ui.md](contracts/perfil-ui.md): vista, formularios, lista, tamaño de página, permisos, estados y accesibilidad.
- [quickstart.md](quickstart.md): arranque, pruebas y recorrido manual.

## Complexity Tracking

No hay violaciones de la constitución. No se requiere justificar complejidad adicional.
