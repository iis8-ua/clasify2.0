---

description: "Task list for the 007-mensajeria feature"
---

# Tasks: Mensajería

**Input**: Design documents from `/specs/007-mensajeria/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Se incluyen tareas de prueba porque el plan y la constitución exigen Vitest para servicios, stores y componentes clave.

**Organization**: Las tareas se agrupan por historia de usuario para que cada una pueda implementarse y validarse de forma independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: Historia de usuario (`US1`–`US4`)
- Todas las tareas incluyen la ruta exacta del archivo afectado

## Path Conventions

- Frontend: `frontend-vue/src/` y `frontend-vue/tests/`
- Backend existente: `backend/` (no se modifica)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar la base de 001–003 y preparar la estructura de mensajería.

- [ ] T001 Confirmar el shell, la sesión, las tarjetas, la paginación, el selector de tamaño y los estados en `frontend-vue/src/`, sin añadir dependencias nuevas
- [ ] T002 [P] Crear la estructura de componentes y pruebas de mensajería en `frontend-vue/src/components/mensajeria/` y `frontend-vue/tests/mensajeria/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Servicio, store, rutas y navegación que necesitan las historias.

**⚠️ CRITICAL**: Ninguna historia puede empezar hasta completar esta fase.

- [X] T003 Implementar `mensajesService` con bandeja, hilo, envío e inicio de conversación en `frontend-vue/src/services/mensajesService.js`
- [X] T004 Implementar `mensajesStore` con estado de bandeja, hilo, operaciones y limpieza por sesión en `frontend-vue/src/stores/mensajes.js`
- [X] T005 Crear las vistas base `MensajesView` y `ConversacionView` y las rutas protegidas `/mensajes` y `/conversaciones/:id` en `frontend-vue/src/views/MensajesView.vue`, `frontend-vue/src/views/ConversacionView.vue` y `frontend-vue/src/router/routes.js`
- [X] T006 [P] Añadir la entrada Mensajes a la navegación de cabecera en `frontend-vue/src/components/layout/navigation.js`, visible solo con sesión
- [X] T007 [P] Reutilizar la normalización de errores de `frontend-vue/src/services/errors.js` para `401`, `403`, `404`, `400` y errores de conexión

**Checkpoint**: La base de mensajería está lista para las historias.

---

## Phase 3: User Story 1 - Contactar con el vendedor desde un anuncio (Priority: P1) 🎯 MVP

**Goal**: Iniciar una conversación desde el detalle y abrir el hilo resultante.

**Independent Test**: Abrir un anuncio ajeno, pulsar Contactar, enviar un mensaje y comprobar que se abre la conversación.

### Tests for User Story 1

- [X] T008 [P] [US1] Crear pruebas del servicio de inicio de conversación en `frontend-vue/tests/mensajeria/mensajesService.spec.js`
- [X] T009 [P] [US1] Crear pruebas del modal de contacto, anuncio propio, anuncio vendido y visitante en `frontend-vue/tests/mensajeria/contactar.spec.js`

### Implementation for User Story 1

- [X] T010 [US1] Implementar `ModalContactar` con campo de texto, validación de 1000 caracteres, carga y error en `frontend-vue/src/components/mensajeria/ModalContactar.vue`
- [X] T011 [US1] Integrar Contactar en `frontend-vue/src/views/AnuncioDetalleView.vue`, ocultando la acción en anuncios propios y deshabilitándola en vendidos sin conversación
- [X] T012 [US1] Conectar el modal con `mensajesService` y `mensajesStore`, tratar `201` y `200`, abrir el hilo y mostrar confirmación en `frontend-vue/src/components/mensajeria/ModalContactar.vue` y `frontend-vue/src/views/ConversacionView.vue`
- [X] T013 [US1] Gestionar el acceso de visitantes con retorno al anuncio y reapertura manual del modal en `frontend-vue/src/components/mensajeria/ModalContactar.vue`
- [X] T014 [US1] Añadir el manejo de `400`, `401`, `404` y conexión en el flujo de contacto, conservando el texto si falla en `frontend-vue/src/components/mensajeria/ModalContactar.vue`

**Checkpoint**: Contactar funciona de forma independiente.

---

## Phase 4: User Story 2 - Consultar mi bandeja de conversaciones (Priority: P1)

**Goal**: Mostrar las conversaciones del usuario con anuncio, contraparte, último mensaje y no leídos.

**Independent Test**: Abrir `/mensajes` como comprador y como vendedor y comprobar las conversaciones.

### Tests for User Story 2

- [X] T015 [P] [US2] Crear pruebas de la bandeja con resultados, vacío, error, no leídos, paginación y tamaño en `frontend-vue/tests/mensajeria/bandeja.spec.js`

### Implementation for User Story 2

- [X] T016 [US2] Implementar `TarjetaConversacion` con anuncio, contraparte, último mensaje, fecha y no leídos en `frontend-vue/src/components/mensajeria/TarjetaConversacion.vue`
- [X] T017 [US2] Implementar `MensajesView` con carga, resultados, vacío, error y reintento en `frontend-vue/src/views/MensajesView.vue`
- [X] T018 [US2] Sincronizar página y tamaño 10/20/50 con la URL en `frontend-vue/src/views/MensajesView.vue`
- [X] T019 [US2] Añadir enlaces al perfil público de la contraparte y al detalle del anuncio en `frontend-vue/src/components/mensajeria/TarjetaConversacion.vue`
- [X] T020 [US2] Limpiar bandeja y no leídos al cambiar `sessionVersion` en `frontend-vue/src/stores/mensajes.js`

**Checkpoint**: La bandeja funciona de forma independiente.

---

## Phase 5: User Story 3 - Leer y responder un hilo de mensajes (Priority: P2)

**Goal**: Abrir el hilo en los últimos mensajes, cargar anteriores y enviar respuestas.

**Independent Test**: Abrir una conversación, cargar mensajes anteriores, enviar una respuesta y comprobar los leídos.

### Tests for User Story 3

- [X] T021 [P] [US3] Crear pruebas del hilo, carga de anteriores, envío, leídos y errores en `frontend-vue/tests/mensajeria/conversacion.spec.js`

### Implementation for User Story 3

- [X] T022 [US3] Implementar `HiloMensajes` con orden cronológico, emisor, fecha y estados en `frontend-vue/src/components/mensajeria/HiloMensajes.vue`
- [X] T023 [US3] Implementar `FormularioMensaje` con validación, carga, doble envío y conservación de texto en `frontend-vue/src/components/mensajeria/FormularioMensaje.vue`
- [X] T024 [US3] Implementar `ConversacionView` con apertura en `desde=final`, carga de anteriores y estado vacío/error en `frontend-vue/src/views/ConversacionView.vue`
- [X] T025 [US3] Integrar `UltimosMensajes` en `frontend-vue/src/views/AnuncioDetalleView.vue`, solo para participantes y sin marcar leídos
- [X] T026 [US3] Sincronizar página y tamaño del hilo con la URL y conservar el contexto al cargar anteriores en `frontend-vue/src/views/ConversacionView.vue`
- [X] T027 [US3] Gestionar `403`, `404`, `401` y conexión en el hilo y el envío, sin revelar mensajes a no participantes en `frontend-vue/src/views/ConversacionView.vue` y `frontend-vue/src/components/mensajeria/FormularioMensaje.vue`

**Checkpoint**: El hilo funciona de forma independiente.

---

## Phase 6: User Story 4 - Usar la mensajería con teclado o en móvil (Priority: P3)

**Goal**: Garantizar accesibilidad y uso a 360 px.

**Independent Test**: Recorrer bandeja, hilo y formulario solo con teclado y en pantalla de 360 px.

### Tests for User Story 4

- [X] T028 [P] [US4] Crear pruebas de accesibilidad de bandeja, hilo, modal y formulario en `frontend-vue/tests/mensajeria/mensajeriaAccessibility.spec.js`

### Implementation for User Story 4

- [X] T029 [US4] Añadir nombres accesibles, etiquetas, `aria-live`, foco visible y orden de tabulación en `frontend-vue/src/components/mensajeria/` y `frontend-vue/src/views/`
- [X] T030 [US4] Ajustar bandeja, hilo y formulario a 360 px en `frontend-vue/src/styles/base.css`
- [X] T031 [US4] Revisar mensajes en español y ausencia de detalles técnicos en `frontend-vue/src/components/mensajeria/` y `frontend-vue/src/views/`

**Checkpoint**: Mensajería accesible y usable en móvil.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentación y validación.

- [X] T032 [P] Actualizar `README.md` y `specs/007-mensajeria/quickstart.md` con la mensajería y sus límites
- [ ] T033 Ejecutar `npm run test:unit`, `npm run build` y la validación de `specs/007-mensajeria/quickstart.md`
- [ ] T034 Revisar ausencia de comentarios, llamadas directas a `fetch`, tiempo real, adjuntos y cambios en `backend/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup y bloquea las historias.
- **User Stories (Phase 3–6)**: dependen de Foundational.
- **Polish (Phase 7)**: depende de las historias.

### User Story Dependencies

- **US1 (P1)**: depende de Foundational; no depende de otras historias.
- **US2 (P1)**: depende de Foundational y de US1 para abrir el hilo desde el detalle.
- **US3 (P2)**: depende de US1 y US2.
- **US4 (P3)**: depende de US1, US2 y US3.

### Within Each Story

- Las pruebas se escriben antes de la implementación.
- El servicio y la store antes de las vistas.
- El modal antes de la integración en el detalle.
- La bandeja antes del hilo.
- La accesibilidad se valida al final.

### Parallel Opportunities

- T002, T006 y T007 pueden ejecutarse en paralelo.
- T008 y T009 pueden ejecutarse en paralelo.
- T016 y T017 comparten la bandeja; deben coordinarse.
- T022 y T023 pueden ejecutarse en paralelo sobre archivos distintos.
- T028 y T030 pueden ejecutarse en paralelo.
- Las pruebas de cada historia pueden ejecutarse en paralelo dentro de su fase.

---

## Parallel Example: User Story 1

```bash
Task: "Crear pruebas del servicio de inicio de conversación en frontend-vue/tests/mensajeria/mensajesService.spec.js"
Task: "Crear pruebas del modal de contacto en frontend-vue/tests/mensajeria/contactar.spec.js"
```

## Parallel Example: User Story 3

```bash
Task: "Implementar HiloMensajes en frontend-vue/src/components/mensajeria/HiloMensajes.vue"
Task: "Implementar FormularioMensaje en frontend-vue/src/components/mensajeria/FormularioMensaje.vue"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 y Phase 2.
2. Completar US1.
3. Validar Contactar y el primer mensaje.
4. No avanzar a US2 hasta que el contacto funcione.

### Incremental Delivery

1. Setup + Foundational → base de mensajería.
2. US1 → contacto y primer mensaje.
3. US2 → bandeja.
4. US3 → hilo y respuestas.
5. US4 → accesibilidad y móvil.
6. Polish → documentación y validación.

---

## Notes

- [P] indica archivos distintos y sin dependencia pendiente.
- [US1]–[US4] permiten trazabilidad con la spec.
- Cada historia debe poder validarse de forma independiente.
- Verificar que las pruebas fallan antes de implementar.
- No modificar `backend/`.
- No añadir comentarios al código.
- Sin tiempo real, adjuntos ni notificaciones push/email.
