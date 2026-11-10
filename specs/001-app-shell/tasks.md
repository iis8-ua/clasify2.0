---

description: "Task list for the 001-app-shell feature"
---

# Tasks: Estructura común y navegación del frontend

**Input**: Design documents from `/specs/001-app-shell/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Se incluyen tareas de prueba porque el plan y la constitución exigen Vitest para servicios, stores y componentes clave. Las pruebas deben escribirse antes de la implementación correspondiente y fallar primero.

**Organization**: Las tareas se agrupan por historia de usuario para que cada una pueda implementarse y validarse de forma independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: Historia de usuario a la que pertenece la tarea (`US1`, `US2`, `US3`, `US4`)
- Todas las tareas incluyen la ruta exacta del archivo afectado

## Path Conventions

- Proyecto frontend: `frontend-vue/src/` y `frontend-vue/tests/`
- Backend existente: `backend/` (no se modifica)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicializar el proyecto frontend y su configuración base.

- [X] T001 Crear la estructura inicial del frontend en `frontend-vue/package.json` y `frontend-vue/index.html`
- [X] T002 Añadir dependencias y scripts exactos en `frontend-vue/package.json`: Vue 3.5.45, Vite 7.3.8, Pinia 3.0.4, Vue Router 4.6.4, PrimeVue 4.5.5, @primeuix/themes 1.2.5, primeicons 7.0.0, Vitest 3.2.7, @vue/test-utils 2.5.1, jsdom 26.1.0 y @vitejs/plugin-vue 6.0.10
- [X] T003 [P] Configurar Vite y Vitest en `frontend-vue/vite.config.js`
- [X] T004 [P] Crear la plantilla de entorno en `frontend-vue/.env.example` con `VITE_API_URL`
- [X] T005 Crear el arranque de la aplicación en `frontend-vue/src/main.js` y `frontend-vue/src/App.vue` con Vue, Pinia, Vue Router y PrimeVue
- [X] T006 Configurar el tema PrimeVue, los servicios de toast y confirmación en `frontend-vue/src/main.js`, `frontend-vue/src/App.vue` y `frontend-vue/src/styles/primevue-theme.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura común que debe existir antes de implementar las historias.

**⚠️ CRITICAL**: Ninguna historia puede empezar hasta completar esta fase.

- [X] T007 Definir la tabla de rutas y sus metadatos en `frontend-vue/src/router/routes.js` sin importar vistas; la conexión de componentes se completa en T013 y T017
- [X] T008 Implementar la estructura de guardas en `frontend-vue/src/router/guards.js`
- [X] T009 Implementar la frontera de sesión en `frontend-vue/src/stores/session.js` con estado de visitante por defecto
- [X] T010 [P] Implementar la capa HTTP base en `frontend-vue/src/services/http.js` y `frontend-vue/src/services/errors.js`
- [X] T011 [P] Crear tokens y estilos globales en `frontend-vue/src/styles/tokens.css` y `frontend-vue/src/styles/base.css`
- [X] T012 Implementar el layout base en `frontend-vue/src/components/layout/AppShell.vue`
- [X] T013 Crear las vistas de sustitución y 404 con contenido mínimo en `frontend-vue/src/views/PlaceholderView.vue` y `frontend-vue/src/views/NotFoundView.vue`
- [X] T014 [P] Crear los componentes de formato con implementación inicial en `frontend-vue/src/components/common/PriceText.vue`, `frontend-vue/src/components/common/DateText.vue` y `frontend-vue/src/components/common/ImageWithFallback.vue`
- [X] T015 [P] Crear el esqueleto de `StatePanel` con su API de props y eventos en `frontend-vue/src/components/states/StatePanel.vue`; las variantes se implementan en T033 y T034
- [X] T016 Crear el esqueleto de `ConfirmAction` y configurar los servicios de Toast y confirmación en `frontend-vue/src/components/states/ConfirmAction.vue` y `frontend-vue/src/App.vue`; el diálogo accesible se implementa en T035
- [X] T017 Conectar las vistas de sustitución con el router y configurar títulos de página en `frontend-vue/src/router/index.js`

**Checkpoint**: La base del frontend está lista para que empiecen las historias.

---

## Phase 3: User Story 1 - Estructura y navegación principal (Priority: P1) 🎯 MVP

**Goal**: Ofrecer una cabecera, una navegación y un layout comunes en todas las vistas.

**Independent Test**: Abrir la aplicación, recorrer las rutas principales y comprobar que la cabecera, la marca, la navegación y el contenido se mantienen coherentes.

### Tests for User Story 1

- [X] T018 [P] [US1] Crear pruebas de cabecera y navegación en `frontend-vue/tests/components/AppHeader.spec.js` y `frontend-vue/tests/components/AppNav.spec.js`

### Implementation for User Story 1

- [X] T019 [P] [US1] Implementar la cabecera en `frontend-vue/src/components/layout/AppHeader.vue`
- [X] T020 [P] [US1] Implementar la navegación y el estado activo en `frontend-vue/src/components/layout/AppNav.vue`
- [X] T021 [US1] Componer cabecera, navegación y contenido en `frontend-vue/src/components/layout/AppShell.vue` y `frontend-vue/src/App.vue`
- [X] T022 [US1] Implementar la visibilidad de acciones por sesión y la acción principal de creación en `frontend-vue/src/components/layout/AppHeader.vue`
- [X] T023 [US1] Conectar la navegación con el router y las rutas en `frontend-vue/src/components/layout/AppNav.vue` y `frontend-vue/src/router/index.js`
- [X] T024 [US1] Verificar la presentación responsive de la cabecera y la navegación en `frontend-vue/src/components/layout/AppShell.vue` y `frontend-vue/src/styles/base.css`

**Checkpoint**: La estructura común y la navegación funcionan de forma independiente.

---

## Phase 4: User Story 2 - Direcciones directas, historial y rutas no encontradas (Priority: P2)

**Goal**: Permitir abrir rutas por URL, recargar, usar atrás/adelante y gestionar rutas desconocidas y protegidas.

**Independent Test**: Abrir directamente cada ruta, recargar, usar el historial y visitar una dirección inexistente.

### Tests for User Story 2

- [X] T025 [P] [US2] Crear pruebas de rutas y guardas en `frontend-vue/tests/router/routes.spec.js` y `frontend-vue/tests/router/guards.spec.js`

### Implementation for User Story 2

- [X] T026 [P] [US2] Completar la página 404 con acción de vuelta al inicio en `frontend-vue/src/views/NotFoundView.vue`
- [X] T027 [US2] Configurar la ruta catch-all y los metadatos de acceso en `frontend-vue/src/router/routes.js`
- [X] T028 [US2] Implementar la redirección de rutas protegidas y el parámetro `redirect` en `frontend-vue/src/router/guards.js`
- [X] T029 [US2] Implementar la redirección de acceso y registro con sesión en `frontend-vue/src/router/guards.js`
- [X] T030 [US2] Completar el estado de sustitución para vistas no implementadas en `frontend-vue/src/views/PlaceholderView.vue`
- [X] T031 [US2] Integrar la restauración de la ruta solicitada tras el acceso en `frontend-vue/src/router/guards.js` y `frontend-vue/src/views/PlaceholderView.vue`

**Checkpoint**: Las URLs directas, el historial, las rutas protegidas y el 404 funcionan de forma independiente.

---

## Phase 5: User Story 3 - Estados y mensajes consistentes (Priority: P3)

**Goal**: Unificar carga, vacío, error, validación, permisos, éxito y confirmaciones.

**Independent Test**: Revisar las vistas de ejemplo y los componentes de estado, comprobando que cada situación se distingue y ofrece la acción esperada.

### Tests for User Story 3

- [X] T032 [P] [US3] Crear pruebas de estados y confirmaciones en `frontend-vue/tests/components/StatePanel.spec.js` y `frontend-vue/tests/components/ConfirmAction.spec.js`

### Implementation for User Story 3

- [X] T033 [P] [US3] Implementar las variantes de carga, vacío, error, validación, permisos y éxito en `frontend-vue/src/components/states/StatePanel.vue`
- [X] T034 [US3] Implementar reintento, acción principal y asociación de errores de campo en `frontend-vue/src/components/states/StatePanel.vue`
- [X] T035 [P] [US3] Implementar el diálogo de confirmación accesible en `frontend-vue/src/components/states/ConfirmAction.vue`
- [X] T036 [P] [US3] Implementar notificaciones de éxito y error en `frontend-vue/src/App.vue` y `frontend-vue/src/main.js`
- [X] T037 [US3] Mapear errores HTTP a estados de interfaz en `frontend-vue/src/services/errors.js` y `frontend-vue/src/components/states/StatePanel.vue`
- [X] T038 [US3] Añadir mensajes en español y evitar detalles técnicos en `frontend-vue/src/components/states/StatePanel.vue`

**Checkpoint**: Los estados y las confirmaciones son coherentes y reutilizables.

---

## Phase 6: User Story 4 - Presentación accesible y coherente (Priority: P4)

**Goal**: Aplicar el tema, la accesibilidad y la adaptación a móvil en toda la estructura.

**Independent Test**: Navegar solo con teclado, revisar foco, etiquetas, contraste, textos alternativos y presentación a 360 px.

### Tests for User Story 4

- [X] T039 [P] [US4] Crear pruebas de accesibilidad, formato y títulos en `frontend-vue/tests/components/accessibility.spec.js` y `frontend-vue/tests/components/formatting.spec.js`

### Implementation for User Story 4

- [X] T040 [P] [US4] Aplicar tokens de color, tipografía, espaciado y forma en `frontend-vue/src/styles/tokens.css` y `frontend-vue/src/styles/base.css`
- [X] T041 [US4] Añadir enlace de salto, landmarks y jerarquía semántica en `frontend-vue/src/components/layout/AppShell.vue` y `frontend-vue/src/components/layout/AppHeader.vue`
- [X] T042 [US4] Implementar gestión de foco al cambiar de ruta en `frontend-vue/src/router/index.js`
- [X] T043 [P] [US4] Completar formatos de precio, fecha e imagen en `frontend-vue/src/components/common/PriceText.vue`, `frontend-vue/src/components/common/DateText.vue` y `frontend-vue/src/components/common/ImageWithFallback.vue`
- [X] T044 [US4] Ajustar el layout a 360 px sin desplazamiento horizontal en `frontend-vue/src/components/layout/AppShell.vue` y `frontend-vue/src/styles/base.css`
- [X] T045 [US4] Verificar títulos de página, textos en español y textos alternativos en `frontend-vue/src/router/index.js` y `frontend-vue/src/components/common/ImageWithFallback.vue`

**Checkpoint**: La estructura es accesible, coherente y usable en móvil.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar documentación, validación y calidad transversal.

- [X] T046 [P] Actualizar `README.md` con instalación, variables de entorno, arranque, pruebas y limitaciones del frontend
- [X] T047 Revisar que no haya comentarios en el código nuevo y que los componentes no llamen a `fetch` directamente en `frontend-vue/src/`
- [X] T048 Ejecutar `npm run test:unit` y `npm run build` en `frontend-vue/` y registrar el resultado
- [X] T049 Ejecutar la validación manual de `specs/001-app-shell/quickstart.md` y registrar rutas, 404, teclado y 360 px
- [X] T050 Confirmar que `backend/` no se ha modificado y documentar las rutas de sustitución en `README.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup y bloquea todas las historias.
- **User Stories (Phase 3–6)**: dependen de Foundational.
- **Polish (Phase 7)**: depende de las historias implementadas.

### User Story Dependencies

- **US1 (P1)**: puede empezar tras Foundational; no depende de otras historias.
- **US2 (P2)**: puede empezar tras Foundational; integra guardas y 404.
- **US3 (P3)**: puede empezar tras Foundational; proporciona estados compartidos.
- **US4 (P4)**: puede empezar tras Foundational; aplica tema y accesibilidad.

### Within Each User Story

- Las pruebas se escriben antes de la implementación correspondiente.
- Los componentes se implementan antes de integrarlos en las vistas.
- La integración con el router se hace después de los componentes.
- Cada historia se valida antes de pasar a la siguiente.

### Parallel Opportunities

- T003, T004, T010, T011, T014 y T015 pueden ejecutarse en paralelo tras T001–T002.
- T019 y T020 pueden ejecutarse en paralelo.
- T026, T033, T035, T036, T040 y T043 pueden ejecutarse en paralelo con otras tareas de archivos distintos.
- Las pruebas de cada historia pueden ejecutarse en paralelo dentro de su fase.

---

## Parallel Example: User Story 1

```bash
Task: "Implementar la cabecera en frontend-vue/src/components/layout/AppHeader.vue"
Task: "Implementar la navegación y el estado activo en frontend-vue/src/components/layout/AppNav.vue"
```

## Parallel Example: User Story 2

```bash
Task: "Completar la página 404 en frontend-vue/src/views/NotFoundView.vue"
Task: "Crear pruebas de rutas y guardas en frontend-vue/tests/router/routes.spec.js"
```

## Parallel Example: User Story 3

```bash
Task: "Implementar variantes de estado en frontend-vue/src/components/states/StatePanel.vue"
Task: "Implementar el diálogo de confirmación en frontend-vue/src/components/states/ConfirmAction.vue"
Task: "Implementar notificaciones en frontend-vue/src/App.vue"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 y Phase 2.
2. Completar Phase 3 (US1).
3. Detenerse y validar la estructura y la navegación.
4. No avanzar a US2 hasta que US1 funcione.

### Incremental Delivery

1. Setup + Foundational → base lista.
2. US1 → estructura y navegación.
3. US2 → URLs, historial y 404.
4. US3 → estados y confirmaciones.
5. US4 → tema, accesibilidad y móvil.
6. Polish → README, pruebas y validación manual.

### Parallel Team Strategy

- Una persona completa Setup y Foundational.
- Después, US1 y US2 pueden avanzar en paralelo con cuidado por los archivos compartidos de router.
- US3 y US4 pueden avanzar en paralelo sobre componentes de estado y estilos.
- La integración final y la validación manual se hacen juntas.

---

## Notes

- [P] indica archivos distintos y sin dependencia pendiente.
- [US1]–[US4] permiten trazabilidad con la spec.
- Cada historia debe poder validarse de forma independiente.
- Verificar que las pruebas fallan antes de implementar.
- Commit después de cada tarea o grupo lógico.
- Detenerse en cada checkpoint para revisar.
- No modificar `backend/`.
- No añadir comentarios al código.
