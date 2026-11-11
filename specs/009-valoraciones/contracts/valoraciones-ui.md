# Ratings UI Contract

**Feature**: `009-valoraciones`  
**Date**: 2026-11-11

## 1. Formulario de valoración

Location:

- Solo en `PerfilPublicoView` de otro usuario.
- No aparece en el perfil propio ni en el detalle del anuncio.

Fields:

| Campo | Control | Reglas |
|---|---|---|
| `puntuacion` | Selector 1–5 | Obligatorio; entero |
| `comentario` | Área de texto | Opcional; máximo 500 |

States:

| Estado | Meaning |
|---|---|
| `idle` | Sin interacción |
| `editing` | Formulario con valores |
| `sending` | Guardando |
| `success` | Valoración guardada |
| `error` | Validación, permisos o conexión |

Rules:

- Se precarga con `mi_valoracion` cuando existe.
- Guardar de nuevo actualiza sin duplicar.
- El botón se deshabilita mientras envía.
- Los errores se asocian al campo.
- El formulario se usa con teclado y a 360 px.

## 2. Eliminar valoración

- La acción solo se ofrece sobre la valoración propia.
- Solicita confirmación con el nombre del destinatario.
- Cancelar no modifica nada.
- Al confirmar, se actualiza el listado y el resumen.
- `404` converge a sin valoración sin error incomprensible.

## 3. Perfil propio

`MisValoracionesSection` contiene:

| Sección | Contenido |
|---|---|
| Recibidas | Autor, puntuación, comentario y fecha |
| Escritas | Destinatario, puntuación, comentario, fecha y acciones |

Query:

| Parámetro | Valores | Default |
|---|---|---|
| `valoracionesRecibidasPagina` | Entero `>= 1` | 1 |
| `valoracionesRecibidasLimite` | `10`, `20`, `50` | 20 |
| `valoracionesEscritasPagina` | Entero `>= 1` | 1 |
| `valoracionesEscritasLimite` | `10`, `20`, `50` | 20 |

Rules:

- Cada listado conserva su página y tamaño de forma independiente.
- Cambiar un tamaño vuelve a la primera página de ese listado.
- Las valoraciones escritas permiten editar y eliminar.
- Editar abre el perfil público del destinatario con el formulario precargado.
- Los estados vacíos son independientes.
- Los autores enlazan a su perfil público.

## 4. Perfil público

- El listado de valoraciones recibidas es de solo lectura y pertenece a 008.
- El formulario de valoración se monta debajo del resumen o del listado.
- El perfil propio no muestra el formulario.
- Un visitante ve el perfil y recibe una invitación a acceder al intentar valorar.

## 5. Permisos

| Situación | UI |
|---|---|
| Visitante | Ve el perfil; al valorar se le pide acceso |
| Autenticado | Puede valorar a otro usuario |
| Perfil propio | No ofrece valorarse a sí mismo |
| Sesión caducada | Limpia sesión y solicita acceso |

Rules:

- La autorización real la comprueba el backend.
- No se muestran datos privados.
- El cierre de sesión limpia listas y formularios privados.

## 6. Errores

| Status | Handling |
|---|---|
| `400` | Error de validación por campo |
| `401` | Limpiar sesión y solicitar acceso |
| `404` | Usuario o valoración no encontrados |
| `5xx` / red | Mensaje comprensible y reintento |

Rules:

- Mensajes en español.
- Sin detalles técnicos.
- Un error no pierde el comentario escrito cuando sea posible.

## 7. Accesibilidad

- Etiquetas asociadas a puntuación y comentario.
- Errores con `role="alert"` y foco en el primer campo inválido.
- Foco visible en tema claro y oscuro.
- Confirmación de borrado accesible por teclado y con retorno de foco.
- Paginación con etiquetas.
- Sin desplazamiento horizontal no intencionado a 360 px.

## 8. Out of Scope

- Moderación.
- Respuestas a valoraciones.
- Votos de utilidad.
- Valoraciones anónimas.
- Ordenación personalizada.
- Formulario en el perfil propio.
- Formulario en el detalle del anuncio.
- Cambios en el backend.
