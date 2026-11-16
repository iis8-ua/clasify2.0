---

description: "Task list for the 010-frontend-alterno-react feature"
---

# Tasks: Frontend alternativo con React

**Input**: Design documents from `/specs/010-frontend-alterno-react/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Se incluyen tareas de prueba porque la spec y la constitución exigen Vitest y React Testing Library para listado, sesión, paginación, borrado, permisos, errores y accesibilidad. Las pruebas deben escribirse antes de la implementación correspondiente y fallar primero.

**Organization**: Las tareas se agrupan por historia de usuario para que cada una pueda implementarse y validarse de forma independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: Historia de usuario (`US1`–`US4`)
- Todas las tareas incluyen la ruta exacta del archivo afectado

## Path Conventions

- Proyecto React: `frontend-react/src/` y `frontend-react/tests/`
- Servicios compartidos: `shared/api/`
- Frontend Vue existente: `frontend-vue/src/` y `frontend-vue/vite.config.js`
- Backend existente: `backend/` (no se modifica)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Crear la estructura del proyecto React y su configuración de pruebas.

- [ ] T001 Crear `frontend-react/` con `package.json`, `vite.config.js`, `index.html`, `.env.example`, `README.md`, `src/main.jsx` y `src/styles.css`
- [ ] T002 [P] Configurar Vitest, `jsdom` y React Testing Library en `frontend-react/vite.config.js` y `frontend-react/tests/setup.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Servicios compartidos, configuración HTTP, sesión y helpers que necesitan todas las historias.

**⚠️ CRITICAL**: Ninguna historia puede empezar hasta completar esta fase.

- [ ] T003 Extraer `http.js`, `errors.js`, `authService.js`, `anunciosService.js` y `categoriasService.js` a `shared/api/`, con la URL de API configurada desde cada aplicación
- [ ] T004 Actualizar `frontend-vue/src/services/http.js`, `errors.js`, `authService.js`, `anunciosService.js` y `categoriasService.js` para reexportar `shared/api/`
- [ ] T005 [P] Añadir `server.fs.allow` y la configuración necesaria para consumir `shared/api/` en `frontend-vue/vite.config.js` y `frontend-react/vite.config.js`
- [ ] T006 Implementar `frontend-react/src/services/sesion.js` con lectura, guardado y borrado del token en `sessionStorage`
- [ ] T007 [P] Implementar `frontend-react/src/services/media.js` para resolver la URL de las imágenes del backend
- [ ] T008 Configurar `frontend-react/src/main.jsx` con `configurarHttp`, `getToken` y `onUnauthorized`
- [ ] T009 Crear el esqueleto de `frontend-react/src/App.jsx` con cabecera, estado de sesión y contenedor principal
- [ ] T010 [P] Añadir estilos base, tokens de color y layout responsive en `frontend-react/src/styles.css`

**Checkpoint**: La base de React y los servicios compartidos están listos para las historias.

---

## Phase 3: User Story 1 - Consultar el listado de anuncios (Priority: P1) 🎯 MVP

**Goal**: Mostrar el listado público paginado con tarjetas, categorías, estados de carga, vacío y error.

**Independent Test**: Abrir React con el backend arrancado, comprobar anuncios reales, cambiar de página y simular vacío y error.

### Tests for User Story 1

- [ ] T011 [P] [US1] Crear pruebas de listado con resultados, vacío, error y reintento en `frontend-react/tests/listado.test.jsx`
- [ ] T012 [P] [US1] Crear pruebas de paginación y corrección de página fuera de rango en `frontend-react/tests/paginacion.test.jsx`

### Implementation for User Story 1

- [ ] T013 [P] [US1] Implementar `frontend-react/src/components/EstadoListado.jsx` para carga, vacío, error y reintento
- [ ] T014 [P] [US1] Implementar `frontend-react/src/components/AnuncioItem.jsx` con imagen o marcador, título, precio, categoría, estado y fecha
- [ ] T015 [P] [US1] Implementar `frontend-react/src/components/Paginacion.jsx` con página actual, total y controles accesibles
- [ ] T016 [US1] Implementar `frontend-react/src/components/ListaAnuncios.jsx` con tarjetas, paginación y estados
- [ ] T017 [US1] Cargar el listado y las categorías desde `frontend-react/src/App.jsx`, con mapa de nombres y texto de respaldo
- [ ] T018 [US1] Gestionar página fuera de rango, recarga al cambiar de página y errores de conexión en `frontend-react/src/App.jsx`

**Checkpoint**: El listado público funciona y es navegable de forma independiente.

---

## Phase 4: User Story 2 - Iniciar y cerrar sesión (Priority: P1)

**Goal**: Permitir el acceso con los usuarios del seed, recuperar la sesión y limpiar el estado al cerrar sesión.

**Independent Test**: Iniciar sesión con Ana, recargar, comprobar que se mantiene la identificación, cerrar sesión y comprobar que desaparecen las acciones privadas.

### Tests for User Story 2

- [ ] T019 [P] [US2] Crear pruebas de login correcto, login incorrecto, recuperación y logout en `frontend-react/tests/login.test.jsx`

### Implementation for User Story 2

- [ ] T020 [P] [US2] Implementar `frontend-react/src/components/LoginForm.jsx` con email, contraseña, validación y estado de envío
- [ ] T021 [US2] Integrar login, recuperación con `/auth/yo` y logout en `frontend-react/src/App.jsx` y `frontend-react/src/services/sesion.js`
- [ ] T022 [US2] Mostrar el usuario autenticado y las acciones de acceso o cierre en `frontend-react/src/App.jsx`
- [ ] T023 [US2] Gestionar `401`, credenciales incorrectas, token inválido y limpieza de sesión en `frontend-react/src/App.jsx`

**Checkpoint**: La sesión funciona y el listado sigue disponible como visitante.

---

## Phase 5: User Story 3 - Eliminar un anuncio propio (Priority: P1)

**Goal**: Eliminar anuncios propios con confirmación, actualizar el listado y respetar permisos.

**Independent Test**: Iniciar sesión con Ana, comprobar que solo sus anuncios muestran borrar, cancelar una vez y confirmar el borrado de un anuncio temporal.

### Tests for User Story 3

- [ ] T024 [P] [US3] Crear pruebas de borrado, confirmación, cancelación, doble envío, permisos y `404` en `frontend-react/tests/borrado.test.jsx`

### Implementation for User Story 3

- [ ] T025 [P] [US3] Implementar `frontend-react/src/components/ConfirmarBorrado.jsx` con título del anuncio, confirmar, cancelar y foco controlado
- [ ] T026 [US3] Mostrar la acción de borrar solo en anuncios propios en `frontend-react/src/components/AnuncioItem.jsx`
- [ ] T027 [US3] Integrar el estado de confirmación y el borrado en `frontend-react/src/App.jsx` usando `anunciosService.eliminar`
- [ ] T028 [US3] Recargar la página tras borrar y ajustar a la página anterior si queda vacía en `frontend-react/src/App.jsx`
- [ ] T029 [US3] Gestionar `403`, `404`, `401`, errores de conexión y doble confirmación en `frontend-react/src/App.jsx` y `frontend-react/src/components/ConfirmarBorrado.jsx`

**Checkpoint**: El borrado de anuncios propios funciona de forma independiente y respeta permisos.

---

## Phase 6: User Story 4 - Usar el frontend alternativo con teclado o en móvil (Priority: P3)

**Goal**: Garantizar accesibilidad y uso a 360 px.

**Independent Test**: Recorrer login, listado, paginación y confirmación solo con teclado y con viewport de 360 px.

### Tests for User Story 4

- [ ] T030 [P] [US4] Crear pruebas de accesibilidad, etiquetas, foco y 360 px en `frontend-react/tests/accesibilidad.test.jsx`

### Implementation for User Story 4

- [ ] T031 [US4] Añadir etiquetas, `role="alert"`, nombres accesibles, foco visible y retorno de foco en `frontend-react/src/components/` y `frontend-react/src/App.jsx`
- [ ] T032 [US4] Ajustar login, listado, paginación y confirmación a 360 px en `frontend-react/src/styles.css`
- [ ] T033 [US4] Revisar mensajes en español, ausencia de detalles técnicos y textos alternativos en `frontend-react/src/`

**Checkpoint**: La interfaz es usable con teclado y en móvil.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentación, validación y revisión de restricciones.

- [ ] T034 [P] Documentar instalación, ejecución, pruebas y diferencias Vue/React en `frontend-react/README.md`
- [ ] T035 [P] Actualizar el checklist de `README.md` y la sección de frontend alternativo
- [ ] T036 Ejecutar las pruebas de Vue y comprobar que la extracción de servicios no rompe `frontend-vue/`
- [ ] T037 Ejecutar pruebas, build y validación de `specs/010-frontend-alterno-react/quickstart.md` en `frontend-react/`
- [ ] T038 Validar contra el backend real el listado, login, borrado de un anuncio temporal, cancelación y logout
- [ ] T039 [P] Registrar comandos, resultados y recorrido manual en `docs/validacion.md`
- [ ] T040 Revisar ausencia de comentarios, llamadas HTTP directas en componentes, dependencias innecesarias y cambios en `backend/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup y bloquea las historias.
- **User Stories (Phase 3–6)**: dependen de Foundational.
- **Polish (Phase 7)**: depende de las historias.

### User Story Dependencies

- **US1 (P1)**: depende de Foundational; entrega el listado público.
- **US2 (P1)**: depende de Foundational; puede probarse con el listado ya visible.
- **US3 (P1)**: depende de US1 y US2 para identificar anuncios propios y confirmar el borrado.
- **US4 (P3)**: depende de US1, US2 y US3.

### Within Each Story

- Las pruebas se escriben antes de la implementación.
- Los servicios y helpers antes de los componentes.
- Los componentes antes de integrarlos en `App.jsx`.
- La lógica de permisos antes de la confirmación visual.
- La accesibilidad se valida al final.

### Parallel Opportunities

- T002 y T010 pueden ejecutarse en paralelo.
- T005, T007 y T010 pueden ejecutarse en paralelo.
- T011 y T012 pueden ejecutarse en paralelo.
- T013, T014 y T015 pueden ejecutarse en paralelo.
- T019 y T020 pueden ejecutarse en paralelo.
- T025 y T026 pueden ejecutarse en paralelo.
- T030 y T032 pueden ejecutarse en paralelo.
- T034 y T035 pueden ejecutarse en paralelo.
- T036 y T037 pueden ejecutarse en paralelo.

---

## Parallel Example: User Story 1

```bash
Task: "Crear pruebas de listado en frontend-react/tests/listado.test.jsx"
Task: "Crear pruebas de paginación en frontend-react/tests/paginacion.test.jsx"
Task: "Implementar EstadoListado en frontend-react/src/components/EstadoListado.jsx"
Task: "Implementar AnuncioItem en frontend-react/src/components/AnuncioItem.jsx"
Task: "Implementar Paginacion en frontend-react/src/components/Paginacion.jsx"
```

## Parallel Example: User Story 2

```bash
Task: "Crear pruebas de login en frontend-react/tests/login.test.jsx"
Task: "Implementar LoginForm en frontend-react/src/components/LoginForm.jsx"
```

## Parallel Example: User Story 3

```bash
Task: "Crear pruebas de borrado en frontend-react/tests/borrado.test.jsx"
Task: "Implementar ConfirmarBorrado en frontend-react/src/components/ConfirmarBorrado.jsx"
```

---

## Implementation Strategy

### MVP First (US1)

1. Completar Phase 1 y Phase 2.
2. Completar US1.
3. Validar el listado público, paginación, vacío y error.
4. No avanzar a US2 hasta que el listado sea estable.

### Incremental Delivery

1. Setup + Foundational → proyecto React y servicios compartidos.
2. US1 → listado público.
3. US2 → sesión.
4. US3 → borrado de anuncios propios.
5. US4 → accesibilidad y móvil.
6. Polish → documentación y validación real.

---

## Notes

- [P] indica archivos distintos y sin dependencia pendiente.
- [US1]–[US4] permiten trazabilidad con la spec.
- Cada tarea debe terminar con un commit o un grupo lógico de commits.
- No se modifica el backend ni se añaden respuestas simuladas a la aplicación.
- No se añaden comentarios al código.
- Los componentes React no deben llamar a `fetch` directamente.
- La autorización final del borrado sigue en el backend.
