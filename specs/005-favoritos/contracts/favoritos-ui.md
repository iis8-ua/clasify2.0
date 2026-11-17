# Favorites UI Contract

**Feature**: `005-favoritos`  
**Date**: 2026-11-10

## 1. Botón de favorito

Location:

- En el detalle de un anuncio ajeno.
- No se muestra en el listado general del catálogo; la lista de favoritos usa `BotonQuitarFavorito`.

Props:

| Prop | Tipo | Reglas |
|---|---|---|
| `anuncio` | `AnuncioDetalle` | Contiene `id`, `autor.id`, `es_favorito` y `num_favoritos` |

Emits:

| Event | Payload | Meaning |
|---|---|---|
| `cambio` | `{ esFavorito, numFavoritos }` | El botón actualizó el estado del detalle |

La implementación delega las operaciones en `favoritosStore`; el componente no construye URLs ni
llama a `fetch`.

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

## 2. Botón de quitar desde la lista

Props:

| Prop | Tipo | Reglas |
|---|---|---|
| `anuncio` | `AnuncioFavorito` | Contiene `id` y `titulo` |

Emits:

| Event | Payload | Meaning |
|---|---|---|
| `quitar` | `anuncioId` | El usuario confirmó la retirada |

Rules:

- El nombre accesible indica que quita el anuncio de favoritos e identifica el anuncio.
- Solicita confirmación antes de llamar al servicio.
- Mientras procesa, se deshabilita y muestra carga.
- Al confirmar, retira la tarjeta y muestra un toast.
- Cancelar no modifica la lista.
- Si el favorito ya no existe, converge a no guardado.
- Si la página queda vacía, se corrige a la última página disponible.

## 3. Lista de favoritos

Ruta: `/favoritos`, protegida.

Query:

| Parámetro | Valores | Default |
|---|---|---|
| `pagina` | Entero `>= 1` | 1 |
| `limite` | `10`, `20`, `50` | 20 |

Rules:

- La página y el tamaño se conservan en la dirección al recargar o compartir.
- La página fuera de rango se corrige a la última disponible solo tras una carga correcta.
- La lista se ordena por fecha de guardado descendente.
- No hay búsqueda, filtros ni ordenación personalizada.
- Cada tarjeta abre el detalle y ofrece `BotonQuitarFavorito`.

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
| Acción | Quitar de favoritos con confirmación |

## 4. Estados de la lista

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

## 5. Paginación

- Primera página.
- Página anterior.
- Página actual y total.
- Página siguiente.
- Última página.
- Selector de tamaño: 10, 20 o 50.

Rules:

- Controles deshabilitados en los extremos.
- Se conservan la página y el tamaño en la URL.
- Cambiar el tamaño vuelve a la primera página.
- Se usa con teclado.
- No hay paginación infinita.

## 6. Permisos

| Situación | UI |
|---|---|
| Visitante | No accede a `/favoritos`; al pulsar favorito se le invita a acceder |
| Autenticado | Accede a su lista y puede añadir/quitar desde el detalle o quitar desde la tarjeta |
| Autor del anuncio | No ve la acción de favorito |
| Sesión caducada | Se limpia la sesión y se solicita acceso |

Rules:

- La lista solo muestra favoritos del usuario autenticado.
- El backend comprueba la propiedad y la sesión.
- No se muestran favoritos de otras cuentas.

## 7. Error Handling

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

## 8. Accessibility

- Botón con nombre accesible que indique la acción.
- Tarjetas y enlaces accesibles por teclado.
- Foco visible.
- Textos alternativos en imágenes.
- Paginación con etiquetas.
- Estados legibles por lectores de pantalla.
- Sin desplazamiento horizontal no intencionado a 360 px.

## 9. Out of Scope

- Favoritos compartidos o públicos.
- Notificaciones.
- Acciones masivas.
- Búsqueda, filtros u ordenación personalizada.
- Sincronización entre dispositivos.
- Estado de favorito en el listado general.
- Cambios en el backend.
