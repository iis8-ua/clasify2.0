# Research: Favoritos

**Feature**: `005-favoritos`  
**Date**: 2026-11-10  
**Status**: Complete — no `NEEDS CLARIFICATION` remaining

## Decisions

### 1. Acción de favorito solo en el detalle

**Decision**: montar `BotonFavorito` únicamente en el detalle de anuncios ajenos. No mostrar el estado de favorito en el listado general ni acciones en las tarjetas.

**Rationale**: el listado general no devuelve `es_favorito`; mostrarlo obligaría a peticiones por tarjeta. Además, la decisión cruzada mantiene una sola ubicación para modificar el estado.

**Alternatives considered**:
- Botón en cada tarjeta del listado: descartado por N+1 y por falta de dato.
- Botón en la lista de favoritos: descartado para no duplicar la acción.

---

### 2. Estado del botón desde el detalle

**Decision**: el detalle de 003 entrega `es_favorito` y `num_favoritos`; `BotonFavorito` recibe el anuncio y delega añadir/quitar en `favoritosStore`, y emite `cambio` al detalle para actualizar el contador.

**Rationale**: evita una consulta adicional, mantiene una única ubicación para modificar el estado y deja la operación HTTP encapsulada en la store y el servicio.

**Alternatives considered**:
- Consultar el estado desde el botón: descartado por una petición extra.
- Mantener un mapa global de estados: innecesario para una sola vista.

---

### 3. Visitante sin sesión

**Decision**: mostrar el botón a un visitante; al pulsarlo, solicitar acceso y volver al anuncio. Tras el acceso, el usuario debe confirmar de nuevo la acción.

**Rationale**: el detalle es público y el botón puede actuar como invitación al acceso. No se automatiza la acción para evitar efectos inesperados tras el login.

**Alternatives considered**:
- Ocultar el botón a visitantes: descartado porque la spec pide la invitación.
- Ejecutar el favorito automáticamente tras el login: descartado por efecto inesperado.

---

### 4. Anuncio propio

**Decision**: ocultar o deshabilitar la acción cuando el usuario es el autor. El backend también rechaza la operación.

**Rationale**: el backend no permite guardar el propio anuncio. La interfaz evita ofrecer una acción inválida.

**Alternatives considered**:
- Mostrar el botón y esperar el error: descartado por mala experiencia.
- Permitir favoritos propios: descartado por contrato del backend.

---

### 5. Añadir y quitar favoritos

**Decision**: añadir es idempotente: si ya existía, el estado sigue guardado. Quitar un favorito inexistente deja el estado no guardado sin un error incomprensible.

**Rationale**: el backend devuelve éxito al añadir un favorito ya existente y `404` al quitar uno que ya no está. La interfaz debe converger al estado correcto.

**Alternatives considered**:
- Tratar el `200` de añadir como error: descartado.
- Mostrar un error técnico al quitar un favorito inexistente: descartado.

---

### 6. Lista de favoritos

**Decision**: `FavoritosView` consume `GET /usuarios/me/favoritos` con `pagina` y `limite=20`. La página se conserva en la URL. La lista se ordena por fecha de guardado descendente.

**Rationale**: coincide con el backend y con la decisión de página en la dirección. El tamaño fijo reduce complejidad.

**Alternatives considered**:
- Paginación infinita: descartada.
- Selector de tamaño: descartado.
- Filtros o búsqueda: fuera de alcance.

---

### 7. Anuncios vendidos y eliminados

**Decision**: los anuncios vendidos siguen en favoritos con su estado. Los anuncios eliminados desaparecen al actualizar la lista; si se intenta abrir su detalle antes, se muestra no encontrado.

**Rationale**: el backend mantiene el favorito de un anuncio vendido, pero elimina el favorito cuando el anuncio se borra por cascada. La interfaz debe reflejar ambos casos.

**Alternatives considered**:
- Ocultar los vendidos: descartado.
- Mantener anuncios eliminados como “no disponibles”: descartado porque el backend ya no los devuelve.

---

### 8. Quitar solo desde el detalle

**Decision**: la lista de favoritos solo muestra los anuncios y abre el detalle. No incluye una acción directa de quitar.

**Rationale**: mantiene una única ubicación para modificar el estado y evita duplicar acciones.

**Alternatives considered**:
- Quitar desde cada tarjeta: descartado por decisión cruzada.
- Acciones masivas: fuera de alcance.

---

### 9. Actualización tras añadir o quitar

**Decision**: actualizar el estado del botón y el número de favoritos del detalle. Marcar la lista de favoritos como obsoleta para que se recargue al volver a abrirla.

**Rationale**: el endpoint de añadir devuelve el favorito, no el anuncio completo. No se puede insertar la tarjeta en la lista sin volver a consultar.

**Alternatives considered**:
- Insertar una tarjeta parcial: descartado por datos incompletos.
- Recargar la lista mientras no está visible: innecesario.

---

### 10. Limpieza al cerrar sesión

**Decision**: `favoritosStore` observa `sessionVersion` de la store de sesión y limpia la lista y el estado al pasar a visitante.

**Rationale**: evita mostrar favoritos de una cuenta anterior y cumple la limpieza de datos privados.

**Alternatives considered**:
- Importar la store de favoritos desde la de sesión: descartado por acoplamiento.
- Limpiar solo al abrir la vista: insuficiente si la vista ya estaba montada.

---

### 11. Errores

**Decision**: manejar `401`, `400` de anuncio propio, `404` al quitar inexistente y errores de conexión. Un `401` limpia la sesión y solicita acceso. Un `404` al quitar converge a no guardado.

**Rationale**: ofrece mensajes comprensibles y mantiene el estado coherente con el backend.

**Alternatives considered**:
- Mostrar errores técnicos: descartado.
- Ignorar errores: descartado.

---

### 12. Pruebas

**Decision**: Vitest cubrirá servicio, store, botón, lista y paginación; el recorrido manual usará los anuncios y usuarios del seed.

**Rationale**: permite probar estados, paginación, permisos y limpieza sin sustituir la comprobación real.

**Alternatives considered**:
- Solo manual: descartado por la constitución.
- E2E automatizado: se deja para el recorrido manual de la Práctica 4.

## Open Questions

Ninguna. Todas las decisiones de `Technical Context` están resueltas para la fase de diseño.
