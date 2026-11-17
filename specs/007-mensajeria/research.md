# Research: Mensajería

**Feature**: `007-mensajeria`  
**Date**: 2026-11-11  
**Status**: Complete — no `NEEDS CLARIFICATION` remaining

## Decisions

### 1. Consulta al abrir, sin tiempo real

**Decision**: cargar bandeja y hilo al abrir o reintentar. No se añade WebSocket, SSE ni polling automático.

**Rationale**: el backend ofrece HTTP paginado; el tiempo real requeriría cambios de infraestructura y no forma parte del alcance.

**Alternatives considered**:
- Polling cada 30 segundos: válido, pero añade carga y no es necesario para el alcance.
- WebSocket/SSE: fuera de alcance y sin soporte del backend.

---

### 2. Hilo desde el final

**Decision**: abrir el hilo con `desde=final`, de modo que la primera página muestre los últimos mensajes. Las páginas anteriores se cargan explícitamente.

**Rationale**: el mensaje más reciente es el contexto que el usuario necesita al entrar.

**Alternatives considered**:
- Abrir por el principio: peor experiencia en hilos largos.
- Cargar todo el hilo: descartado por tamaño y rendimiento.

---

### 3. Marcar leídos al abrir

**Decision**: el `GET` del hilo marca como leídos los mensajes pendientes del otro participante. La bandeja deja de mostrarlos como no leídos.

**Rationale**: es la semántica que ya aplica el backend y evita duplicar reglas en el frontend.

**Alternatives considered**:
- Marcar al hacer scroll: no hay endpoint específico.
- No marcar: el contador quedaría permanentemente alto.

---

### 4. Primer mensaje desde el detalle

**Decision**: un modal en el detalle permite escribir el primer mensaje. Al enviarlo se crea o reutiliza la conversación y se abre su hilo.

**Rationale**: evita crear hilos vacíos y mantiene el contexto del anuncio.

**Alternatives considered**:
- Navegar a una vista de conversación nueva: más pasos.
- Formulario inline: añade ruido al detalle.

---

### 5. Anuncios propios y vendidos

**Decision**: ocultar Contactar en anuncios propios. En anuncios vendidos sin conversación previa, deshabilitar la acción con un aviso. Si ya existe hilo, permitir continuar.

**Rationale**: replica las reglas del backend y evita ofrecer acciones que terminarán en error.

**Alternatives considered**:
- Delegar siempre en el error del backend: peor experiencia.
- Permitir hilos nuevos en vendidos: el backend lo rechaza.

---

### 6. Bandeja y no leídos

**Decision**: mostrar no leídos por conversación en la bandeja. No añadir contador global exacto en la cabecera.

**Rationale**: el backend devuelve `no_leidos` por conversación, no un total global.

**Alternatives considered**:
- Calcular el total cargando todas las páginas: coste innecesario y posiblemente incompleto.
- Badge local basado en lo consultado: confuso.

---

### 7. Tamaño de página

**Decision**: reutilizar el selector 10/20/50 de 003 en la bandeja y el hilo. Cambiar el tamaño vuelve a la primera página y se conserva en la URL.

**Rationale**: mantiene consistencia con el resto de listados paginados.

**Alternatives considered**:
- 20 fijo: descartado por la ampliación de alcance.
- Paginación infinita: fuera de alcance.

---

### 8. Enlaces al perfil público

**Decision**: el anuncio, la contraparte y el autor de un mensaje enlazan a `/usuarios/:id` cuando corresponda.

**Rationale**: el perfil público de 008 es el contexto de confianza de la conversación.

**Alternatives considered**:
- Mostrar el perfil en un modal: descartado por duplicación y falta de URL compartible.

---

### 9. Errores y sesión

**Decision**: `401` limpia la sesión y solicita acceso; `403` muestra permisos; `404` muestra conversación no encontrada; los fallos de red muestran reintento. Los datos privados se limpian con `sessionVersion`.

**Rationale**: sigue la convención del resto de la aplicación y protege los hilos.

**Alternatives considered**:
- Mostrar mensajes técnicos: descartado.
- Mantener el hilo tras cerrar sesión: descartado.

---

### 10. Pruebas

**Decision**: Vitest cubrirá servicio, store, bandeja, hilo, modal de contacto, paginación, permisos y accesibilidad. La validación manual usará Ana y Carlos del seed.

**Rationale**: permite comprobar comprador, vendedor, anuncio vendido, visitante y sesión caducada sin sustituir el backend real.

**Alternatives considered**:
- Solo manual: descartado por la constitución.
- E2E de navegador: se deja para la validación manual de la Práctica 4.

## Open Questions

Ninguna. Todas las decisiones de `Technical Context` están resueltas para la fase de diseño.
