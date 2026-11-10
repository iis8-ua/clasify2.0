# Research: Gestión de anuncios

**Feature**: `004-gestion-anuncios`  
**Date**: 2026-11-10  
**Status**: Complete — no `NEEDS CLARIFICATION` remaining

## Decisions

### 1. Entradas de creación y gestión

**Decision**: iniciar la creación desde la acción principal de la cabecera. La llamada contextual del estado vacío de “Mis anuncios” se implementa en la spec 006. Ofrecer editar, eliminar y cambiar estado únicamente en el detalle.

**Rationale**: evita duplicar acciones en listas y mantiene un único lugar de gestión por anuncio. La cabecera da acceso permanente; el estado vacío pertenece a la vista de perfil de 006.

**Alternatives considered**:
- Crear desde cada tarjeta del listado: descartado por duplicación.
- Gestionar desde la lista de anuncios propios: descartado para no repetir menús.
- Crear solo desde el estado vacío: descartado porque no sirve cuando ya hay anuncios.

---

### 2. Formulario compartido para crear y editar

**Decision**: crear `AnuncioForm.vue` con modos `crear` y `editar`, valores iniciales, valores actuales, errores por campo, estado de envío e imagen.

**Rationale**: los campos y validaciones son los mismos. Compartir el formulario evita divergencias y reduce duplicación.

**Alternatives considered**:
- Dos formularios separados: descartado por duplicación.
- Un formulario genérico sin modo: descartado porque editar necesita valores originales y detección de cambios.

---

### 3. Precio como texto decimal

**Decision**: usar un campo de texto con `inputmode="decimal"` y validar con una expresión decimal propia; no usar un control numérico que dependa del separador local.

**Rationale**: el backend espera un decimal con punto y hasta dos decimales. Evita que el navegador convierta `12,50` en un valor ambiguo o redondee antes de validar.

**Alternatives considered**:
- `InputNumber`: descartado por el riesgo de separadores locales y formato automático.
- Enviar el precio sin validar: descartado por la validación del backend y la experiencia.

---

### 4. Imagen opcional y sustitución

**Decision**: aceptar una sola imagen JPEG, PNG o WebP de hasta 5 MB. Mostrar previsualización accesible y permitir sustituirla. No permitir dejar el campo vacío sin subir otra.

**Rationale**: coincide con el backend y con el alcance aprobado. La previsualización reduce errores antes de enviar.

**Alternatives considered**:
- Varias imágenes: fuera de alcance.
- Eliminar la imagen sin sustituirla: el backend no lo permite.
- Subida automática al seleccionar: descartado para mantener una sola operación de guardado.

---

### 5. JSON sin imagen y `FormData` con imagen

**Decision**: enviar JSON cuando no hay imagen y `multipart/form-data` cuando hay una imagen nueva.

**Rationale**: el backend admite ambos formatos. `FormData` es necesario para el archivo; JSON es más simple para el resto.

**Alternatives considered**:
- Enviar siempre `FormData`: válido, pero más complejo para formularios sin imagen.
- Enviar siempre JSON: no permite subir la imagen.

---

### 6. Edición parcial

**Decision**: comparar los valores actuales con los originales y enviar solo los campos modificados. Si no hay cambios ni imagen nueva, no se envía la operación.

**Rationale**: evita actualizaciones innecesarias y el error del backend cuando no hay campos editables.

**Alternatives considered**:
- Enviar todos los campos: descartado porque el backend admite PATCH parcial y se enviarían cambios no realizados.
- Enviar siempre la imagen actual: no es posible sin volver a subirla.

---

### 7. Cancelación de edición

**Decision**: cancelar restaura los valores originales, descarta la imagen nueva y no realiza ninguna petición. Si hay cambios, se pide confirmación; si no, se sale directamente.

**Rationale**: ofrece una salida segura y evita pérdidas accidentales.

**Alternatives considered**:
- Cancelar sin confirmación: descartado si hay cambios.
- Guardar automáticamente: descartado; no hay borradores.

---

### 8. Confirmaciones de eliminar y marcar como vendido

**Decision**: usar el componente compartido `ConfirmAction` de 001, basado en PrimeVue ConfirmDialog, para eliminar y para marcar como vendido. Cancelar no ejecuta la acción. Volver a disponible no requiere confirmación.

**Rationale**: eliminar es irreversible y marcar como vendido retira el anuncio del listado por defecto. Volver a disponible es una acción reversible y directa.

**Alternatives considered**:
- Confirmar todas las acciones: descartado por fricción innecesaria.
- No confirmar el borrado: descartado por riesgo de pérdida.

---

### 9. Actualización de listado y detalle

**Decision**: tras crear, editar, eliminar o cambiar estado, actualizar la store de anuncios, invalidar o recargar el listado afectado y navegar según el resultado:
- Crear: detalle del nuevo anuncio.
- Editar: permanecer en el detalle.
- Eliminar: volver al listado.
- Cambiar estado: permanecer en el detalle y refrescar listado.

**Rationale**: evita recargas manuales y mantiene coherencia entre las vistas del catálogo.

**Alternatives considered**:
- Recargar toda la aplicación: descartado.
- Actualización optimista sin confirmación: descartado para evitar estados inconsistentes ante errores.

---

### 10. Cambio de estado separado de la edición

**Decision**: el estado se cambia desde una acción específica del detalle, no desde el formulario de edición.

**Rationale**: separa la edición de datos de la transición de estado y coincide con el contrato del backend.

**Alternatives considered**:
- Incluir `estado` en el formulario: descartado porque el backend usa una operación separada.

---

### 11. Permisos y errores

**Decision**: mostrar acciones solo al autor y confiar en el backend para la comprobación real. Manejar `401`, `403`, `404`, validación, imagen y conexión con mensajes comprensibles.

**Rationale**: la interfaz no es una barrera de seguridad. El backend sigue siendo la autoridad.

**Alternatives considered**:
- Ocultar acciones sin comprobar en backend: descartado.
- Mostrar detalles técnicos: descartado.

---

### 12. Cambios sin guardar

**Decision**: advertir antes de salir del formulario si hay cambios o una imagen nueva seleccionada.

**Rationale**: evita pérdidas accidentales al navegar fuera de la edición o creación.

**Alternatives considered**:
- Guardar automáticamente: fuera de alcance.
- No advertir: descartado por experiencia.

---

### 13. Pruebas

**Decision**: Vitest cubrirá servicio, store, formulario, acciones y confirmaciones; el recorrido manual se hará con los usuarios y anuncios del seed.

**Rationale**: permite probar validaciones, permisos, cancelación y actualizaciones sin sustituir la comprobación real.

**Alternatives considered**:
- Solo manual: descartado por la constitución.
- E2E automatizado: se deja para el recorrido manual de la Práctica 4.

## Open Questions

Ninguna. Todas las decisiones de `Technical Context` están resueltas para la fase de diseño.
