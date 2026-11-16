# Implementation Plan: Frontend alternativo con React

**Branch**: `010-frontend-alterno-react` | **Date**: 2026-11-16 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/010-frontend-alterno-react/spec.md`

## Summary

Implementar un frontend alternativo en React que consuma el mismo backend y la misma autenticación
que Clasify. El alcance se limita al listado público paginado y al borrado de anuncios propios con
confirmación. La sesión identifica al autor y permite mostrar la acción de borrar solo en sus
anuncios.

La implementación reutiliza la capa de servicios independiente del framework. Para ello se extraen
`http`, `errors`, `authService` y `anunciosService` a `shared/api/`, y tanto Vue como React los
consumen. El backend, el esquema y los contratos existentes no se modifican.

## Technical Context

**Language/Version**: JavaScript ES2022; React `19.3.1`; Node.js `^20.19.0 || >=22.12.0`

**Primary Dependencies**:
- React `19.3.1`
- React DOM `19.3.1`
- Vite `7.3.8`
- `@vitejs/plugin-react` `6.3.0`
- `fetch` nativo; sin axios
- Sin router y sin biblioteca de componentes para React

**Storage**:
- Token de sesión en `sessionStorage`.
- Usuario autenticado en el estado de React, recuperado con `GET /auth/yo`.
- Listado y paginación en el estado de React; sin persistencia local.
- Sin almacenamiento de anuncios ni datos privados de otros usuarios.

**Testing**: Vitest `3.2.7`, React Testing Library `16.3.3`, `@testing-library/jest-dom` `7.0.1`,
`jsdom` `26.1.0`; validación manual y prueba de integración opcional contra el backend real.

**Target Platform**: Aplicación web en navegadores modernos de escritorio y móvil.

**Project Type**: Proyecto React separado sobre el backend REST existente.

**Performance Goals**:
- Listado visible en menos de 2 segundos en entorno local.
- Cambio de página con feedback inmediato.
- Borrado con confirmación perceptible en menos de 1 segundo en condiciones normales.
- Sin desplazamiento horizontal no intencionado a 360 px.

**Constraints**:
- No modificar el backend, el esquema ni los contratos existentes.
- No implementar crear, editar, detalle, favoritos, perfil, mensajería ni valoraciones en React.
- No usar router ni PrimeVue en React.
- Paginación fija de 20 anuncios por página.
- El listado es público; el borrado requiere sesión.
- La autorización real la sigue comprobando el backend.
- No añadir comentarios al código.
- No realizar llamadas HTTP directas desde componentes React.
- Interfaz en español, accesible y usable a 360 px.
- Ejecutar React en un puerto permitido por CORS o ajustar `FRONTEND_ORIGIN` en el entorno local.

**Scale/Scope**:
- 4 endpoints existentes: login, sesión actual, listado y borrado.
- 1 proyecto React independiente.
- 1 vista principal.
- 6 componentes de interfaz.
- 4 módulos compartidos de servicios.
- 4 historias de usuario.
- Sin cambios en el backend.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / requisito | Estado | Evidencia |
|---|---|---|
| I. Simplicidad y mantenibilidad | PASS | El alcance se limita a listado y borrado; se reutilizan los servicios existentes y no se añaden router ni bibliotecas de UI. |
| II. Arquitectura y separación de responsabilidades | PASS | Los componentes React solo presentan y gestionan interacción; el estado vive en hooks y el HTTP en `shared/api/`. |
| III. Código limpio y sin comentarios | PASS | Las tareas exigirán código autoexplicativo y cero comentarios. |
| IV. Consistencia y convenciones | PASS | Se mantienen PascalCase para componentes, camelCase para funciones y los nombres del contrato del backend. |
| V. Seguridad y protección de datos | PASS | La sesión se guarda en `sessionStorage`, el borrado se limita al autor y el backend conserva la autoridad final. |
| VI. Experiencia de usuario y accesibilidad | PASS | Carga, vacío, error, reintento, confirmación, teclado, foco, nombres accesibles y 360 px. |
| VII. Desarrollo orientado a especificaciones | PASS | El alcance se limita a 010; no se duplican las funcionalidades de 001–009. |
| VIII. Calidad y verificabilidad | PASS | Vitest y Testing Library cubrirán listado, sesión, paginación, borrado, permisos y errores. |
| Tecnología obligatoria | PASS | React con Vite y `fetch`; Vue se mantiene y solo se ajusta para consumir los servicios compartidos. |
| Gobernanza | PASS | El segundo frontend es un requisito explícito del apartado adicional; no hay excepciones no justificadas. |

**Post-Phase 1 re-check**: PASS. El diseño mantiene una única vista, reutiliza los servicios sin
duplicar lógica, conserva la autorización en el backend y no altera el frontend Vue más allá de los
imports compartidos.

## Project Structure

### Documentation (this feature)

```text
specs/010-frontend-alterno-react/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── api.md
│   └── ui.md
├── checklists/
│   └── requirements.md
└── tasks.md              # Se genera con /speckit.tasks
```

### Source Code (repository root)

```text
shared/
└── api/
    ├── http.js
    ├── errors.js
    ├── authService.js
    └── anunciosService.js

frontend-react/
├── package.json
├── vite.config.js
├── index.html
├── .env.example
├── README.md
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── LoginForm.jsx
│   │   ├── ListaAnuncios.jsx
│   │   ├── AnuncioItem.jsx
│   │   ├── ConfirmarBorrado.jsx
│   │   ├── Paginacion.jsx
│   │   └── EstadoListado.jsx
│   ├── services/
│   │   └── sesion.js
│   └── styles.css
└── tests/
    ├── login.test.jsx
    ├── listado.test.jsx
    ├── paginacion.test.jsx
    ├── borrado.test.jsx
    ├── errores.test.jsx
    ├── accesibilidad.test.jsx
    └── integracion/
        └── backendReal.test.jsx

frontend-vue/
├── vite.config.js                  # añade acceso al directorio compartido
└── src/services/
    ├── http.js                     # reexporta shared/api/http.js
    ├── errors.js                   # reexporta shared/api/errors.js
    ├── authService.js              # reexporta shared/api/authService.js
    └── anunciosService.js          # reexporta shared/api/anunciosService.js
```

**Structure Decision**: se añade un proyecto React separado en `frontend-react/` y una capa de
servicios compartida en `shared/api/`. Vue mantiene sus rutas, stores y componentes; únicamente sus
módulos de servicio pasan a reexportar la implementación compartida. React usa una única vista con
estado local, sin router ni Pinia. La confirmación de borrado se resuelve dentro de la misma vista.

## Phase 0: Research

Resultado en [research.md](research.md). Decisiones principales:

- React con Vite y JavaScript, sin TypeScript.
- Proyecto separado `frontend-react/`, no una ruta dentro de Vue.
- Listado público con paginación fija de 20.
- Login necesario para borrar; el listado sigue siendo público.
- Token en `sessionStorage` y recuperación de sesión con `GET /auth/yo`.
- Servicios compartidos en `shared/api/`; sin duplicar la capa HTTP.
- La URL de la API se configura al arrancar cada aplicación; la capa compartida no depende de
  variables específicas de Vue.
- Sin router ni PrimeVue; una única vista y componentes React.
- Confirmación de borrado en línea, con foco y anuncio identificado.
- Borrado solo visible para el autor; el backend conserva la autorización final.
- Tests con Vitest y React Testing Library; integración real opcional.
- Sin cambios en backend, esquema o contratos.

## Phase 1: Design & Contracts

- [data-model.md](data-model.md): anuncio, página, sesión, estado del listado y confirmación.
- [contracts/api.md](contracts/api.md): login, sesión actual, listado y borrado.
- [contracts/ui.md](contracts/ui.md): vista, login, listado, paginación, borrado, errores y
  accesibilidad.
- [quickstart.md](quickstart.md): arranque del backend, instalación de React, pruebas y recorrido
  manual con los usuarios del seed.

## Complexity Tracking

No hay violaciones de la constitución. El segundo frontend es un requisito explícito del apartado
adicional y la extracción de servicios evita duplicar la lógica HTTP.
