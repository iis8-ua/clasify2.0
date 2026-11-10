# Implementation Plan: Gestión de anuncios

**Branch**: `004-gestion-anuncios` | **Date**: 2026-11-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/004-gestion-anuncios/spec.md`

## Summary

Implementar la creación, edición, cancelación de edición, eliminación y cambio de estado de anuncios. La feature se apoya en el shell de `001-app-shell`, la sesión de `002-autenticacion-sesion` y el catálogo de `003-catalogo-anuncios`.

Las acciones de edición, eliminación y cambio de estado se ofrecen únicamente en el detalle. La creación se inicia desde la cabecera; la llamada contextual del estado vacío de “Mis anuncios” se conecta en la spec 006. Los formularios validan los campos, permiten cancelar sin guardar, avisan de cambios sin guardar y actualizan el detalle y el listado sin recargar la página. El backend no se modifica.

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
- Sin persistencia de formularios ni borradores.
- La imagen seleccionada se mantiene en memoria hasta el envío.
- La imagen existente se muestra desde la URL del backend.
- La sesión se lee de la store de 002; no se usa `localStorage`.

**Testing**: Vitest `3.2.7`, `@vue/test-utils` `2.5.1`, `jsdom` `26.1.0`; validación manual contra el backend real.

**Target Platform**: Aplicación web en navegadores modernos de escritorio y móvil.

**Project Type**: Frontend SPA Vue sobre el backend REST existente.

**Performance Goals**:
- Formulario de creación utilizable en menos de 2 segundos en entorno local.
- Confirmación de guardado, borrado o cambio de estado en menos de 1 segundo en condiciones normales.
- Previsualización de imagen sin bloquear el formulario.
- Sin desplazamiento horizontal no intencionado a 360 px.

**Constraints**:
- No modificar el backend.
- No implementar favoritos, perfil, mensajería ni valoraciones.
- No permitir cambiar el autor desde el formulario.
- No permitir cambiar el estado desde el formulario de edición.
- No permitir eliminar la imagen sin sustituirla.
- No admitir varias imágenes, texto enriquecido, borradores, autoguardado, acciones masivas ni
  administración de anuncios ajenos.
- No añadir comentarios al código.
- No realizar llamadas HTTP directas desde componentes.
- Crear desde la cabecera; la llamada del estado vacío de “Mis anuncios” corresponde a 006. No crear
  desde cada tarjeta.
- Acciones de gestión solo desde el detalle.
- Interfaz en español, accesible y usable a 360 px.

**Scale/Scope**:
- 4 endpoints de escritura existentes: crear, editar, cambiar estado y eliminar.
- 2 vistas nuevas: crear y editar.
- 1 store de anuncios ampliada.
- 1 servicio de anuncios ampliado.
- 6 historias de usuario.
- Sin cambios en el backend.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / requisito | Estado | Evidencia |
|---|---|---|
| I. Simplicidad y mantenibilidad | PASS | Se reutilizan el shell, la sesión, el catálogo, la capa HTTP y los componentes comunes; no se añaden dependencias. |
| II. Arquitectura y separación de responsabilidades | PASS | Formularios, acciones de detalle, store y servicio mantienen responsabilidades separadas; los componentes no harán HTTP directo. |
| III. Código limpio y sin comentarios | PASS | Las tareas exigirán código autoexplicativo y cero comentarios. |
| IV. Consistencia y convenciones | PASS | Se mantienen PascalCase, camelCase, nombres del backend y componentes comunes de formato. |
| V. Seguridad y protección de datos | PASS | Solo el autor gestiona sus anuncios; el frontend oculta acciones y el backend las comprueba; no se exponen datos privados. |
| VI. Experiencia de usuario y accesibilidad | PASS | Validación por campo, carga, errores, confirmaciones, cancelación segura, teclado y 360 px. |
| VII. Desarrollo orientado a especificaciones | PASS | El alcance se limita a la gestión; favoritos, perfil y otras funcionalidades quedan fuera. |
| VIII. Calidad y verificabilidad | PASS | Vitest cubrirá servicio, store, formularios y acciones; el recorrido manual usará el backend real. |
| Tecnología obligatoria | PASS | Vue, Vite, Pinia, Vue Router, PrimeVue y `fetch`; sin cambios en el backend. |
| Gobernanza | PASS | No hay violaciones ni excepciones que justificar. |

**Post-Phase 1 re-check**: PASS. El diseño mantiene las acciones en el detalle, la creación en cabecera/estado vacío y no invade favoritos ni perfil.

## Project Structure

### Documentation (this feature)

```text
specs/004-gestion-anuncios/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── anuncios-write-api.md
│   └── management-ui.md
├── checklists/
│   └── requirements.md
└── tasks.md              # Se genera con /speckit.tasks
```

### Source Code (repository root)

```text
frontend-vue/
├── src/
│   ├── components/
│   │   └── anuncios/
│   │       ├── AccionesAnuncio.vue
│   │       ├── AnuncioForm.vue
│   │       └── CampoImagen.vue
│   ├── router/
│   │   └── routes.js
│   ├── services/
│   │   └── anunciosService.js
│   ├── stores/
│   │   └── anuncios.js
│   └── views/
│       ├── AnuncioCrearView.vue
│       └── AnuncioEditarView.vue
└── tests/
    └── gestion/
        ├── anunciosService.spec.js
        ├── anunciosStore.spec.js
        ├── anuncioForm.spec.js
        ├── accionesAnuncio.spec.js
        ├── cancelarEdicion.spec.js
        └── confirmaciones.spec.js
```

**Structure Decision**: se reutiliza `frontend-vue/` y los componentes comunes de 001–003. Las rutas de creación y edición sustituyen sus placeholders. `AnuncioForm` se comparte entre crear y editar. `AccionesAnuncio` se monta solo en el detalle y solo para el autor. `anunciosService` y `anunciosStore` amplían la capa del catálogo con operaciones de escritura.

## Phase 0: Research

Resultado en [research.md](research.md). Decisiones principales:

- Crear desde cabecera y estado vacío de “Mis anuncios”; acciones de gestión solo en detalle.
- Formulario compartido para crear y editar, con modo y valores originales.
- Precio como texto decimal validado; no usar `InputNumber` con separadores locales.
- Control de archivo accesible; una sola imagen; sustitución sin eliminación.
- Envío JSON sin imagen y `FormData` con imagen.
- Edición parcial: solo campos modificados; sin cambios no se envía.
- Cancelación local con confirmación si hay cambios.
- Confirmaciones PrimeVue para eliminar y marcar como vendido.
- Actualización de listado y detalle mediante la store de 003.
- Vitest para servicio, store, formularios, acciones y confirmaciones.

## Phase 1: Design & Contracts

- [data-model.md](data-model.md): formulario, payloads, estado del anuncio, confirmaciones y validaciones.
- [contracts/anuncios-write-api.md](contracts/anuncios-write-api.md): crear, editar, cambiar estado y eliminar.
- [contracts/management-ui.md](contracts/management-ui.md): entradas, formularios, cancelación, confirmaciones, permisos y errores.
- [quickstart.md](quickstart.md): arranque, pruebas y recorrido manual.

## Complexity Tracking

No hay violaciones de la constitución. No se requiere justificar complejidad adicional.
