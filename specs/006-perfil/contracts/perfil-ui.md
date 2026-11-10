# Profile UI Contract

**Feature**: `006-perfil`  
**Date**: 2026-11-10

## 1. Profile View

Ruta: `/perfil`, protegida.

Sections:

| Sección | Contenido |
|---|---|
| Datos | Nombre, email, biografía, fecha de alta y resumen de valoraciones |
| Edición de datos | Nombre y biografía |
| Contraseña | Contraseña actual y nueva |
| Mis anuncios | Lista paginada de anuncios propios |

Rules:

- El email se muestra como dato informativo y no se puede editar.
- El perfil solo es accesible para el usuario autenticado.
- La cabecera se actualiza al cambiar el nombre.
- No se muestra el email de otras cuentas.

## 2. PerfilDatosForm

Fields:

| Campo | Control | Reglas |
|---|---|---|
| `nombre` | Texto | Obligatorio; máximo 100 |
| `biografia` | Área de texto | Máximo 500 |

States:

| Estado | Meaning |
|---|---|
| `idle` | Sin cambios |
| `editing` | Formulario con valores |
| `dirty` | Cambios sin guardar |
| `saving` | Guardando |
| `saveSuccess` | Guardado correcto |
| `saveError` | Error de validación o conexión |

Rules:

- El email no forma parte del formulario.
- No se envía una edición sin cambios.
- Los errores se asocian al campo correspondiente.
- Un guardado correcto actualiza el perfil y la cabecera.
- Salir con cambios solicita confirmación.
- El formulario es accesible con teclado y a 360 px.

## 3. CambioContrasenaForm

Fields:

| Campo | Control | Reglas |
|---|---|---|
| `passwordActual` | Contraseña | Obligatorio |
| `passwordNueva` | Contraseña | Obligatorio; mínimo 8 caracteres |

Rules:

- La contraseña no se muestra después del envío.
- Una contraseña actual incorrecta muestra un error de formulario.
- La sesión se mantiene tras una contraseña actual incorrecta.
- Un cambio correcto muestra confirmación y limpia los campos.
- Los errores de validación se asocian al campo correspondiente.
- No se envía `email`.

## 4. MisAnunciosSection

Query:

| Parámetro | Valores | Default |
|---|---|---|
| `pagina` | Entero `>= 1` | 1 |

Rules:

- `limite` es fijo en 20 y no se expone en la URL.
- La página se conserva en la dirección.
- La página fuera de rango se corrige a la última disponible.
- Solo se muestran anuncios del usuario.
- Los anuncios vendidos se muestran con su estado.
- Cada tarjeta abre el detalle.
- La lista no ofrece acciones de edición, eliminación ni cambio de estado.
- No hay búsqueda, filtros ni ordenación personalizada.

Card:

| Elemento | Regla |
|---|---|
| Imagen | Diferida; marcador si no existe |
| Título | Visible |
| Precio | EUR/es-ES |
| Categoría | Nombre real |
| Estado | Disponible o vendido |
| Fecha | Formateada |
| Enlace | Abre el detalle |

## 5. Empty State

- Sin anuncios: estado vacío específico.
- El estado vacío incluye una acción para crear un anuncio.
- La acción reutiliza la ruta de creación de 004.
- La acción solo se muestra a usuarios autenticados.

## 6. Errors

| Status | Handling |
|---|---|
| `401` de sesión | Limpiar sesión y solicitar acceso |
| `401` de contraseña actual | Error de formulario; mantener sesión |
| `400` | Error de validación por campo |
| `5xx` / red | Error comprensible y reintento |

Rules:

- Los mensajes están en español.
- No se exponen detalles técnicos.
- No se pierden datos del formulario ante un error de conexión cuando sea posible.
- La contraseña no se conserva visible.

## 7. Permissions

| Situación | UI |
|---|---|
| Visitante | No accede a `/perfil` |
| Autenticado | Ve y edita su propio perfil |
| Otra cuenta | No puede consultar el perfil privado |
| Sesión caducada | Se limpia la sesión y se solicita acceso |

Rules:

- La autorización real la comprueba el backend.
- No se muestra el email de otras cuentas.
- No se muestran datos privados tras cerrar sesión.

## 8. Accessibility

- Etiquetas asociadas a todos los campos.
- Errores accesibles y asociados al campo.
- Foco visible.
- Navegación por teclado.
- Textos alternativos en imágenes.
- Paginación con etiquetas.
- Sin desplazamiento horizontal no intencionado a 360 px.
- Jerarquía de encabezados comprensible.

## 9. Out of Scope

- Perfil público de otros usuarios.
- Avatar o imagen de perfil.
- Eliminación de cuenta.
- Cambio de email y verificación.
- Recuperación de contraseña.
- Autenticación en dos pasos.
- Mensajería y valoraciones.
- Preferencias de privacidad o notificaciones.
- Historial de actividad.
- Búsqueda, filtros u ordenación de anuncios propios.
- Acciones de gestión en la lista de anuncios propios.
