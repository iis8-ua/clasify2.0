# Research: Perfil propio

**Feature**: `006-perfil`  
**Date**: 2026-11-10  
**Status**: Complete — no `NEEDS CLARIFICATION` remaining

## Decisions

### 1. Perfil propio y email informativo

**Decision**: `PerfilView` consume `GET /usuarios/me` y muestra nombre, email, biografía, fecha de alta y resumen de valoraciones. El email se muestra como dato informativo y no se puede editar.

**Rationale**: el email es visible solo para el propio usuario y el backend no permite cambiarlo. Mostrarlo como campo de solo lectura evita intentos inválidos.

**Alternatives considered**:
- Ocultar el email: descartado porque forma parte del perfil propio.
- Permitir editarlo: descartado por contrato del backend.

---

### 2. Edición separada de datos y contraseña

**Decision**: usar un formulario para nombre y biografía y otro para cambio de contraseña.

**Rationale**: separa dos operaciones con validaciones y errores distintos. Evita enviar la contraseña en una actualización de datos y facilita conservar los datos si falla la contraseña.

**Alternatives considered**:
- Un único formulario con todos los campos: descartado por mezclar responsabilidades.
- Cambio de contraseña en una vista separada: válido, pero añade navegación innecesaria.

---

### 3. Contraseña actual obligatoria

**Decision**: el cambio de contraseña solicita la contraseña actual y una nueva de al menos 8 caracteres. La nueva no se muestra después del envío.

**Rationale**: coincide con el backend y protege la cuenta frente a cambios no autorizados.

**Alternatives considered**:
- Permitir cambiar sin la actual: descartado por el contrato.
- Enviar la nueva contraseña con la edición de datos: descartado por separación.

---

### 4. Contraseña actual incorrecta

**Decision**: mostrar un error de formulario, mantener la sesión y conservar el resto de datos. No se trata como sesión caducada.

**Rationale**: el backend devuelve un error de credenciales, no un token inválido. La sesión debe mantenerse para que el usuario corrija el campo.

**Alternatives considered**:
- Limpiar la sesión: descartado porque expulsa al usuario por un error de escritura.
- Descartar el formulario: descartado por pérdida de datos.

---

### 5. Actualización de sesión y cabecera

**Decision**: tras guardar nombre o biografía, actualizar el usuario de la store de sesión y la cabecera.

**Rationale**: el nombre visible de la cabecera debe reflejar el cambio sin recargar.

**Alternatives considered**:
- Recargar la página: descartado.
- Mantener el usuario anterior: descartado por inconsistencia.

---

### 6. Lista de anuncios propios

**Decision**: consumir `GET /usuarios/me/anuncios` con `pagina` y `limite`. La página y el tamaño (10, 20 o 50; 20 por defecto) se conservan en la URL. La lista solo muestra los anuncios y abre el detalle.

**Rationale**: coincide con el backend y con la decisión de página en la dirección. La gestión se centraliza en el detalle de 004.

**Alternatives considered**:
- Acciones directas en la lista: descartado por decisión cruzada.
- Búsqueda, filtros u ordenación: fuera de alcance.
- Paginación infinita: descartada.
- Mantener 20 fijo: descartado por la ampliación de alcance.

---

### 7. Anuncios vendidos y estado vacío

**Decision**: los anuncios vendidos se muestran con su estado. Si el usuario no tiene anuncios, el estado vacío ofrece una acción para crear un anuncio.

**Rationale**: el backend devuelve todos los anuncios propios, incluidos los vendidos. La acción contextual enlaza con la creación de 004.

**Alternatives considered**:
- Ocultar vendidos: descartado.
- Estado vacío sin acción: descartado por la decisión de creación contextual.

---

### 8. Página fuera de rango

**Decision**: si la página solicitada supera `paginas`, corregir a la última disponible.

**Rationale**: evita una página vacía y mantiene la URL coherente.

**Alternatives considered**:
- Mostrar vacío con enlace: válido, pero menos directo.
- Ignorar: descartado.

---

### 9. Limpieza al cerrar sesión

**Decision**: `perfilStore` observa `sessionVersion` de la store de sesión y limpia perfil y anuncios propios al pasar a visitante.

**Rationale**: evita mostrar datos privados de una cuenta anterior.

**Alternatives considered**:
- Limpiar solo al abrir la vista: insuficiente si ya estaba montada.
- Importar la store de perfil desde sesión: descartado por acoplamiento.

---

### 10. Errores y permisos

**Decision**: manejar `401`, validación, contraseña actual incorrecta, conexión y errores de carga. La vista es solo para el usuario autenticado.

**Rationale**: ofrece mensajes comprensibles y mantiene la privacidad. La autorización real sigue en el backend.

**Alternatives considered**:
- Mostrar errores técnicos: descartado.
- Ocultar el perfil a usuarios no autenticados solo con CSS: descartado; la ruta está protegida.

---

### 11. Cambios sin guardar

**Decision**: advertir antes de salir del formulario de datos si hay cambios. El formulario de contraseña se limpia al enviar y no conserva la contraseña.

**Rationale**: evita perder cambios de perfil y evita conservar contraseñas en memoria visible.

**Alternatives considered**:
- Autoguardado: fuera de alcance.
- No advertir: descartado.

---

### 12. Pruebas

**Decision**: Vitest cubrirá servicio, store, formularios, enlace al perfil público, tamaño de página y paginación; el recorrido manual usará los usuarios y anuncios del seed.

**Rationale**: permite probar edición, contraseña, privacidad y paginación sin sustituir la comprobación real.

**Alternatives considered**:
- Solo manual: descartado por la constitución.
- E2E automatizado: se deja para el recorrido manual de la Práctica 4.

---

### 13. Enlace al perfil público propio

**Decision**: mostrar en `/perfil` un enlace a `/usuarios/:id` usando el identificador del usuario autenticado.

**Rationale**: permite comprobar la vista pública propia sin duplicar su implementación, que pertenece a 008.

**Alternatives considered**:
- Incrustar el perfil público dentro de `/perfil`: descartado por duplicación.
- No enlazar: descartado porque el usuario no podría revisar su imagen pública.

## Open Questions

Ninguna. Todas las decisiones de `Technical Context` están resueltas para la fase de diseño.
