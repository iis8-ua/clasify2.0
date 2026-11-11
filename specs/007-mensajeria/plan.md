# Implementation Plan: Mensajería

**Branch**: `007-mensajeria` | **Date**: 2026-11-11 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/007-mensajeria/spec.md`

## Summary

Implementar la mensajería del frontend: bandeja de conversaciones, hilo paginado, envío de mensajes de texto, contacto desde el detalle y contador de no leídos por conversación. La feature se apoya en el shell y el tema de 001, la sesión de 002, el catálogo y el perfil público de 003 y 008, y los endpoints existentes de conversaciones y mensajes.

La mensajería es de texto, sin tiempo real ni adjuntos. Los mensajes se consultan al abrir la bandeja o el hilo. El backend no se modifica.

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
- Sin persistencia local de conversaciones ni mensajes.
- La bandeja y el hilo viven en la store de Pinia.
- La sesión se lee de la store de 002.
- La página y el tamaño de página se conservan en la URL.
- La preferencia de tema se lee de 001; no se añade almacenamiento nuevo.

**Testing**: Vitest `3.2.7`, `@vue/test-utils` `2.5.1`, `jsdom` `26.1.0`; validación manual contra el backend real.

**Target Platform**: Aplicación web en navegadores modernos de escritorio y móvil.

**Project Type**: Frontend SPA Vue sobre el backend REST existente.

**Performance Goals**:
- Bandeja visible en menos de 2 segundos en entorno local.
- Apertura de un hilo con feedback inmediato.
- Envío de mensaje con confirmación perceptible en menos de 1 segundo en condiciones normales.
- Sin desplazamiento horizontal no intencionado a 360 px.

**Constraints**:
- No modificar el backend.
- No implementar tiempo real, adjuntos, notificaciones push/email ni conversaciones grupales.
- Solo los participantes pueden leer y escribir en un hilo.
- No iniciar conversaciones sobre anuncios propios.
- No iniciar conversaciones nuevas sobre anuncios vendidos; un hilo existente puede continuar.
- Mensajes de texto de hasta 1000 caracteres.
- No añadir comentarios al código.
- No realizar llamadas HTTP directas desde componentes.
- Interfaz en español, accesible y usable a 360 px.

**Scale/Scope**:
- 5 endpoints existentes: bandeja, hilo, envío, inicio por anuncio y conversación del comprador.
- 2 vistas nuevas: bandeja y conversación.
- 1 store: `mensajes`.
- 1 servicio: `mensajesService`.
- 4 historias de usuario.
- Sin cambios en el backend.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / requisito | Estado | Evidencia |
|---|---|---|
| I. Simplicidad y mantenibilidad | PASS | Se reutilizan el shell, la sesión, las tarjetas, la paginación, los estados y el tamaño de página; no se añaden dependencias. |
| II. Arquitectura y separación de responsabilidades | PASS | Vistas, componentes de mensajería, store y servicio mantienen responsabilidades separadas; los componentes no harán HTTP directo. |
| III. Código limpio y sin comentarios | PASS | Las tareas exigirán código autoexplicativo y cero comentarios. |
| IV. Consistencia y convenciones | PASS | Se mantienen PascalCase, camelCase, nombres del backend y componentes compartidos. |
| V. Seguridad y protección de datos | PASS | Solo los participantes acceden al hilo; la sesión se limpia al cerrar sesión; no se muestran datos privados de terceros. |
| VI. Experiencia de usuario y accesibilidad | PASS | Carga, vacío, error, confirmación, teclado, foco, textos alternativos, contraste y 360 px. |
| VII. Desarrollo orientado a especificaciones | PASS | El alcance se limita a 007; no se añade tiempo real, adjuntos ni notificaciones. |
| VIII. Calidad y verificabilidad | PASS | Vitest cubrirá servicio, store, bandeja, hilo, envío, permisos y paginación; el recorrido manual usará el backend real. |
| Tecnología obligatoria | PASS | Vue, Vite, Pinia, Vue Router, PrimeVue y `fetch`; sin cambios en el backend. |
| Gobernanza | PASS | No hay violaciones ni excepciones que justificar. |

**Post-Phase 1 re-check**: PASS. El diseño mantiene la mensajería como consulta HTTP, limita el acceso a participantes y no introduce tiempo real ni datos privados fuera de la sesión.

## Project Structure

### Documentation (this feature)

```text
specs/007-mensajeria/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── mensajeria-api.md
│   └── mensajeria-ui.md
├── checklists/
│   └── requirements.md
└── tasks.md              # Se genera con /speckit.tasks
```

### Source Code (repository root)

```text
frontend-vue/
├── src/
│   ├── components/
│   │   ├── mensajeria/
│   │   │   ├── TarjetaConversacion.vue
│   │   │   ├── HiloMensajes.vue
│   │   │   ├── FormularioMensaje.vue
│   │   │   ├── ModalContactar.vue
│   │   │   └── UltimosMensajes.vue
│   │   └── catalog/
│   │       └── SelectorTamanoPagina.vue
│   ├── router/
│   │   └── routes.js
│   ├── services/
│   │   └── mensajesService.js
│   ├── stores/
│   │   └── mensajes.js
│   └── views/
│       ├── MensajesView.vue
│       └── ConversacionView.vue
└── tests/
    └── mensajeria/
        ├── mensajesService.spec.js
        ├── mensajesStore.spec.js
        ├── bandeja.spec.js
        ├── conversacion.spec.js
        ├── contactar.spec.js
        ├── mensajesPageSize.spec.js
        └── mensajeriaAccessibility.spec.js
```

**Structure Decision**: se reutiliza `frontend-vue/` y los componentes compartidos de 001–003. Las rutas `/mensajes` y `/conversaciones/:id` usan vistas nuevas. `mensajesStore` mantiene bandeja, hilo y operaciones; `mensajesService` usa la capa HTTP base. `ModalContactar` se monta en el detalle de 003 y `UltimosMensajes` solo para participantes.

## Phase 0: Research

Resultado en [research.md](research.md). Decisiones principales:

- La bandeja y el hilo se cargan al abrir o reintentar; sin polling ni tiempo real.
- El hilo abre en los últimos mensajes con `desde=final` y permite cargar anteriores.
- Abrir el hilo marca como leídos los mensajes del otro participante.
- El primer mensaje se envía desde un modal en el detalle y crea o reutiliza la conversación.
- El autor no puede contactar consigo mismo.
- Un anuncio vendido sin conversación previa deshabilita el contacto; un hilo existente continúa.
- Visitante: login y retorno al anuncio, con reapertura manual del modal.
- Texto máximo de 1000 caracteres; sin adjuntos.
- Tamaño de página 10/20/50 compartido; no hay contador global en la cabecera.
- Vitest para servicio, store, bandeja, hilo, contacto, tamaño y accesibilidad.

## Phase 1: Design & Contracts

- [data-model.md](data-model.md): conversación, mensaje, bandeja, hilo, paginación y estados.
- [contracts/mensajeria-api.md](contracts/mensajeria-api.md): bandeja, hilo, envío, inicio y errores.
- [contracts/mensajeria-ui.md](contracts/mensajeria-ui.md): rutas, bandeja, hilo, modal, paginación, permisos y accesibilidad.
- [quickstart.md](quickstart.md): arranque, pruebas y recorrido manual con los usuarios del seed.

## Complexity Tracking

No hay violaciones de la constitución. No se requiere justificar complejidad adicional.
