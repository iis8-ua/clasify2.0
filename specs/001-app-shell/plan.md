# Implementation Plan: Estructura común y navegación del frontend

**Branch**: `001-app-shell` | **Date**: 2026-11-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-app-shell/spec.md`

## Summary

Crear la base del frontend Vue de Clasify: estructura visual común, cabecera con acción de creación para usuarios autenticados, navegación por URL, rutas protegidas, página 404, estados de interfaz compartidos, tema visual, accesibilidad y capa HTTP base. Esta feature no implementa los flujos de negocio de autenticación, catálogo, gestión de anuncios, favoritos ni perfil; deja las rutas y sustituciones preparadas para las specs 002–006.

El enfoque técnico es una aplicación Vue 3 con Vite, Pinia, Vue Router y PrimeVue, escrita en JavaScript, con una separación estricta entre vistas, componentes, stores, servicios y router. El backend existente no se modifica.

## Technical Context

**Language/Version**: JavaScript ES2022; Vue `3.5.45`; Node.js `^20.19.0 || >=22.12.0` (el entorno local verificado es `v26.8.2`)

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

**Storage**: Sin datos de negocio persistentes en esta feature. `sessionStorage` queda reservado para la sesión de la spec 002. La configuración de la API se lee de `VITE_API_URL`.

**Testing**: Vitest `3.2.7`, `@vue/test-utils` `2.5.1`, `jsdom` `26.1.0`; comprobación manual de rutas, accesibilidad y responsive.

**Target Platform**: Aplicación web en navegadores modernos de escritorio y móvil. Entorno de desarrollo con Node.js y npm.

**Project Type**: Frontend web SPA dentro del repositorio existente, contra un backend REST ya terminado.

**Performance Goals**:
- Primera pintura de la estructura común en menos de 2 segundos en entorno local.
- Cambio de ruta percibido en menos de 100 ms una vez cargada la aplicación.
- Sin desplazamiento horizontal no intencionado a 360 px de ancho.
- Interacciones de navegación y teclado sin bloqueos perceptibles.

**Constraints**:
- No modificar el backend, el esquema ni los contratos existentes.
- No implementar flujos de negocio en esta feature.
- No añadir comentarios al código.
- No realizar llamadas HTTP directas desde componentes.
- No usar axios, TypeScript, Tailwind, modo oscuro ni selector de tamaño de página.
- Interfaz en español y en un único modo claro.
- Diseño usable a 360 px y con navegación por teclado.

**Scale/Scope**:
- 9 rutas: listado, detalle, acceso, registro, creación, edición, favoritos, perfil y 404.
- 4 historias de usuario del shell.
- 1 layout principal, 1 cabecera, 1 navegación y un conjunto reducido de estados compartidos.
- Sin llamadas a datos de negocio en esta feature.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / requisito | Estado | Evidencia |
|---|---|---|
| I. Simplicidad y mantenibilidad | PASS | Solo se implementa el esqueleto y las dependencias aprobadas; no se añaden capas ni flujos de negocio. |
| II. Arquitectura y separación de responsabilidades | PASS | La estructura separa `components`, `views`, `stores`, `services`, `router` y `styles`; los componentes no harán HTTP directo. |
| III. Código limpio y sin comentarios | PASS | El plan y las tareas exigirán código autoexplicativo y cero comentarios en el código nuevo o modificado. |
| IV. Consistencia y convenciones | PASS | Nombres PascalCase para componentes y vistas, camelCase para JavaScript, rutas y estados con nombres canónicos. |
| V. Seguridad y protección de datos | PASS | No se almacenan secretos ni datos privados; la sesión queda como frontera para la spec 002; el backend no se modifica. |
| VI. Experiencia de usuario y accesibilidad | PASS | Se definen estados comunes, 404, confirmaciones, foco visible, teclado, textos alternativos y diseño a 360 px. |
| VII. Desarrollo orientado a especificaciones | PASS | El alcance se limita a `001-app-shell`; las funcionalidades de negocio quedan en specs posteriores. |
| VIII. Calidad y verificabilidad | PASS | Vitest cubrirá router, servicios y componentes clave; habrá comprobación manual de rutas, teclado y responsive. |
| Tecnología obligatoria | PASS | Vue, Vite, Pinia, Vue Router, PrimeVue y `fetch`; sin cambios en el backend. |
| Gobernanza | PASS | No hay violaciones ni excepciones que justificar. |

**Post-Phase 1 re-check**: PASS. El diseño mantiene el alcance fundacional y no introduce dependencias ni flujos fuera de la constitución.

## Project Structure

### Documentation (this feature)

```text
specs/001-app-shell/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── ui-contracts.md
│   └── http-contract.md
├── checklists/
│   └── requirements.md
└── tasks.md              # Se genera con /speckit.tasks
```

### Source Code (repository root)

```text
frontend-vue/
├── .env.example
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── App.vue
│   ├── main.js
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── states/
│   ├── router/
│   │   ├── index.js
│   │   ├── routes.js
│   │   └── guards.js
│   ├── services/
│   │   ├── http.js
│   │   └── errors.js
│   ├── stores/
│   │   └── session.js
│   ├── styles/
│   │   ├── base.css
│   │   ├── tokens.css
│   │   └── primevue-theme.js
│   └── views/
│       └── NotFoundView.vue
└── tests/
    ├── components/
    ├── router/
    └── services/
```

**Structure Decision**: se crea un único proyecto frontend en `frontend-vue/`. El backend existente en `backend/` se mantiene intacto. Las vistas de negocio de las specs 002–006 se incorporarán en `src/views/` y sus stores y servicios en `src/stores/` y `src/services/`, sin duplicar la infraestructura de esta feature.

## Phase 0: Research

Resultado en [research.md](research.md). Decisiones principales:

- Versiones estables y compatibles: Vue 3.5.45, Vite 7.3.8, Pinia 3.0.4, Vue Router 4.6.4, PrimeVue 4.5.5 y Vitest 3.2.7.
- PrimeVue 4.5.5 con `@primeuix/themes` 1.2.5 y `primeicons` 7.0.0, con tema neutral personalizado y sin modo oscuro.
- `fetch` nativo y capa HTTP propia; sin axios.
- Vitest + Vue Test Utils + jsdom para servicios, router y componentes clave.
- Sin cambios en el backend.

## Phase 1: Design & Contracts

- [data-model.md](data-model.md): rutas, vistas, estados, navegación, sesión de presentación y tokens visuales.
- [contracts/ui-contracts.md](contracts/ui-contracts.md): contrato de rutas, navegación, cabecera, estados y formato.
- [contracts/http-contract.md](contracts/http-contract.md): configuración, peticiones, respuestas, errores y frontera de sesión.
- [quickstart.md](quickstart.md): instalación, arranque y validación manual.

## Complexity Tracking

No hay violaciones de la constitución. No se requiere justificar complejidad adicional.
