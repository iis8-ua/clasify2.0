# Favorites UI Contract

**Feature**: `005-favoritos`  
**Date**: 2026-11-10

## 1. Botón de favorito

Location:

- Solo en el detalle de un anuncio ajeno.
- No se muestra en el listado general ni en las tarjetas de favoritos.

Props:

| Prop | Tipo | Reglas |
|---|---|---|
| `anuncioId` | number | Anuncio del detalle |
| `esFavorito` | boolean | Estado inicial desde el detalle |
| `numFavoritos` | number | Número informativo |
| `esAutor` | boolean | Si es verdadero, la acción no se ofrece |
| `autenticado` | boolean | Si es falso, se solicita acceso |

Emits:

| Event | Payload | Meaning |
|---|---|---|
| `toggle` | `{ anuncioId, nuevoEstado }` | Solicitud de añadir o quitar |
| `login-required` | `{ anuncioId }` | Visitante que intenta guardar |

States:

- `idle` no guardado.
- `idle` guardado.
- `procesando`.
- `guardado`.
- `no guardado`.
- `error`.

Rules:

- El nombre accesible indica si añade o quita.
- El botón se deshabilita mientras procesa.
- Un visitante que pulsa recibe una invitación a acceder y vuelve al anuncio.
- Tras el acceso, el usuario debe pulsar de nuevo para confirmar la acción.
- El autor no ve la acción como disponible.
- El número de favoritos se actualiza tras la operación.
- El botón se usa con teclado y tiene foco visible.

## 2. Lista de favoritos

Ruta: `/favoritos`, protegida.

Query:

| Parámetro | Valores | Default |
|---|---|---|
| `pagina` | Entero `>= 1` | 1 |

Rules:

- `limite` es fijo en 20 y no se expone en la URL.
- La página se conserva en la dirección al recargar o compartir.
- La página fuera de rango se corrige a la última disponible.
- La lista se ordena por fecha de guardado descendente.
- No hay búsqueda, filtros ni ordenación personalizada.
- No hay acción de quitar en las tarjetas.
- Cada tarjeta abre el detalle.

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

## 3. Estados de la lista

| Estado | Representación |
|---|---|
| `loading` | Indicador de carga |
| `success` | Lista con resultados |
| `empty` | Sin favoritos; invitación a explorar |
| `error` | Mensaje comprensible y reintento |

Rules:

- `empty` y `error` son distintos.
- Un anuncio eliminado desaparece al actualizar la lista.
- Si se intenta abrir un anuncio eliminado antes de actualizar, el detalle muestra no encontrado.
- Los anuncios vendidos siguen visibles con su estado.
- La lista se limpia al cerrar sesión.

## 4. Paginación

- Primera página.
- Página anterior.
- Página actual y total.
- Página siguiente.
- Última página.

Rules:

- Controles deshabilitados en los extremos.
- Se conserva la página en la URL.
- Se usa con teclado.
- No hay selector de tamaño ni paginación infinita.

## 5. Permisos

| Situación | UI |
|---|---|
| Visitante | No accede a `/favoritos`; al pulsar favorito se le invita a acceder |
| Autenticado | Accede a su lista y puede añadir/quitar desde el detalle |
| Autor del anuncio | No ve la acción de favorito |
| Sesión caducada | Se limpia la sesión y se solicita acceso |

Rules:

- La lista solo muestra favoritos del usuario autenticado.
- El backend comprueba la propiedad y la sesión.
- No se muestran favoritos de otras cuentas.

## 6. Error Handling

| Status | Handling |
|---|---|
| `400` | Anuncio propio no favoritable |
| `401` | Limpiar sesión y solicitar acceso |
| `404` al quitar | Estado no guardado |
| `404` al abrir detalle | Anuncio no encontrado |
| `5xx` / red | Error comprensible y reintento |

Rules:

- Los mensajes están en español.
- No se exponen detalles técnicos.
- Un error no deja datos privados obsoletos.

## 7. Accessibility

- Botón con nombre accesible que indique la acción.
- Tarjetas y enlaces accesibles por teclado.
- Foco visible.
- Textos alternativos en imágenes.
- Paginación con etiquetas.
- Estados legibles por lectores de pantalla.
- Sin desplazamiento horizontal no intencionado a 360 px.

## 8. Out of Scope

- Favoritos compartidos o públicos.
- Notificaciones.
- Acciones masivas.
- Quitar desde la lista.
- Búsqueda, filtros u ordenación personalizada.
- Sincronización entre dispositivos.
- Estado de favorito en el listado general.
- Modo oscuro.
- Cambios en el backend.
