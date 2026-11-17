# Implementation Plan: Registro, acceso y sesión de usuario

**Branch**: `002-autenticacion-sesion` | **Date**: 2026-11-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-autenticacion-sesion/spec.md`

## Summary

Implementar el registro, el inicio de sesión, la restauración de sesión al recargar, el cierre de sesión y la recuperación ante una sesión caducada. La feature se apoya en la estructura común de `001-app-shell`, en la capa HTTP base y en el contrato de sesión de la cabecera.

El token se conserva en `sessionStorage` y la identidad se recupera contra `GET /auth/yo`. El cierre de sesión es local, porque el backend no ofrece logout ni revocación de tokens. Los datos privados de otras stores se limpian mediante una versión de sesión que las stores posteriores observan. No se modifica el backend.

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
- Token JWT en `sessionStorage`, clave `clasify.session.token`.
- Usuario en memoria en la store de sesión.
- Sin persistencia de contraseñas, perfiles ni datos privados.
- Sin `localStorage` y sin sincronización entre pestañas.

**Testing**: Vitest `3.2.7`, `@vue/test-utils` `2.5.1`, `jsdom` `26.1.0`; validación manual contra el backend real.

**Target Platform**: Aplicación web en navegadores modernos de escritorio y móvil. Backend en `http://localhost:3000/clasify_api`.

**Project Type**: Frontend SPA Vue sobre un backend REST existente.

**Performance Goals**:
- Formularios de acceso y registro utilizables en menos de 2 segundos en entorno local.
- Confirmación visual de login o registro en menos de 1 segundo en condiciones normales.
- Restauración de sesión sin bloquear la interfaz más de lo necesario.
- Sin desplazamiento horizontal no intencionado a 360 px.

**Constraints**:
- No modificar el backend.
- No añadir refresh tokens, recuperación de contraseña, verificación de email, proveedores externos, perfil público, mensajería ni valoraciones.
- No usar `localStorage`.
- No sincronizar sesión entre pestañas.
- No añadir comentarios al código.
- No realizar llamadas HTTP directas desde componentes.
- Mantener la sesión actual tras una contraseña actual incorrecta; ese caso es un error de formulario, no una sesión caducada.
- Interfaz en español, accesible y usable a 360 px.

**Scale/Scope**:
- 3 endpoints existentes: registro, acceso y consulta de sesión.
- 2 vistas nuevas: acceso y registro.
- 1 store de sesión y 1 servicio de autenticación.
- 6 historias de usuario.
- Sin datos de negocio propios.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / requisito | Estado | Evidencia |
|---|---|---|
| I. Simplicidad y mantenibilidad | PASS | Se reutilizan la estructura y la capa HTTP de 001; no se añaden dependencias ni flujos innecesarios. |
| II. Arquitectura y separación de responsabilidades | PASS | Vistas y componentes de formulario, store de sesión, servicio de autenticación, guardas y cabecera mantienen responsabilidades separadas. |
| III. Código limpio y sin comentarios | PASS | Las tareas exigirán código autoexplicativo y cero comentarios. |
| IV. Consistencia y convenciones | PASS | Se mantienen PascalCase para componentes, camelCase para JavaScript y los nombres de campos del backend. |
| V. Seguridad y protección de datos | PASS | Token en `sessionStorage`, contraseña no persistida ni mostrada, logout local, limpieza de datos privados y autorización real en backend. |
| VI. Experiencia de usuario y accesibilidad | PASS | Formularios con etiquetas, errores por campo, carga, bloqueo de doble envío, teclado y diseño a 360 px. |
| VII. Desarrollo orientado a especificaciones | PASS | El alcance se limita a registro, acceso, sesión y logout; el perfil queda para 006. |
| VIII. Calidad y verificabilidad | PASS | Vitest cubrirá servicio, store, guardas y formularios; habrá recorrido manual contra el backend real. |
| Tecnología obligatoria | PASS | Vue, Vite, Pinia, Vue Router, PrimeVue y `fetch`; sin cambios en el backend. |
| Gobernanza | PASS | No hay violaciones ni excepciones que justificar. |

**Post-Phase 1 re-check**: PASS. El diseño no introduce flujos de perfil ni cambios de backend, y mantiene la separación entre error de credenciales y sesión caducada.

## Project Structure

### Documentation (this feature)

```text
specs/002-autenticacion-sesion/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── auth-api.md
│   └── session-contract.md
├── checklists/
│   └── requirements.md
└── tasks.md              # Se genera con /speckit.tasks
```

### Source Code (repository root)

```text
frontend-vue/
├── src/
│   ├── components/
│   │   └── auth/
│   │       ├── AuthCard.vue
│   │       ├── LoginForm.vue
│   │       └── RegisterForm.vue
│   ├── router/
│   │   └── guards.js
│   ├── services/
│   │   └── authService.js
│   ├── stores/
│   │   └── session.js
│   └── views/
│       ├── LoginView.vue
│       └── RegisterView.vue
└── tests/
    ├── auth/
    │   ├── authService.spec.js
    │   ├── sessionStore.spec.js
    │   ├── guards.spec.js
    │   └── forms.spec.js
    └── components/
```

**Structure Decision**: se reutiliza `frontend-vue/` creado en 001. Las vistas `LoginView` y `RegisterView` sustituyen sus placeholders. El servicio `authService` usa la capa HTTP base; la store `session` implementa la frontera de sesión; `guards.js` conecta las rutas protegidas y de acceso con esa store. No se crean vistas ni stores de perfil.

## Phase 0: Research

Resultado en [research.md](research.md). Decisiones principales:

- `sessionStorage` con clave `clasify.session.token`; usuario solo en memoria.
- `useSessionStore` como única fuente de sesión; `sessionVersion` para que las stores privadas limpien sus datos al cerrar sesión.
- `authService` con registro, acceso y `/auth/yo`.
- Restauración con token guardado y estado de comprobación.
- `401` de sesión limpia la sesión; `401` de credenciales de login o cambio de contraseña se trata como error de formulario.
- Sin refresh token, sin sincronización entre pestañas y sin logout en servidor.
- Vitest para servicio, store, guardas y formularios.

## Phase 1: Design & Contracts

- [data-model.md](data-model.md): cuenta, credenciales, sesión, estados de sesión, formulario y errores.
- [contracts/auth-api.md](contracts/auth-api.md): registro, acceso y consulta de sesión.
- [contracts/session-contract.md](contracts/session-contract.md): store, almacenamiento, guardas, cabecera, limpieza y frontera de `401`.
- [quickstart.md](quickstart.md): instalación, backend, pruebas y recorrido manual.

## Complexity Tracking

No hay violaciones de la constitución. No se requiere justificar complejidad adicional.
