# Public Profile UI Contract

**Feature**: `008-perfil-publico`  
**Date**: 2026-11-11

## 1. Ruta

| Ruta | Nombre | Acceso | Vista |
|---|---|---|---|
| `/usuarios/:id` | `perfil-publico` | Pública | `PerfilPublicoView` |

Rules:

- Se abre directamente por URL y sobrevive a recarga.
- Se enlaza desde autor, contraparte, autor de valoración y perfil propio.
- Un identificador inválido muestra un mensaje comprensible.

## 2. Secciones

| Sección | Contenido |
|---|---|
| Datos | Nombre, biografía, fecha de alta y resumen de valoraciones |
| Valoraciones | Listado paginado de valoraciones recibidas |
| Anuncios | Listado paginado de anuncios publicados |

Rules:

- No se muestra email ni datos privados.
- La biografía ausente usa un texto de ausencia.
- La vista es de solo lectura.
- No se ofrecen acciones de edición, gestión ni valoración en esta feature.

## 3. Query de URL

| Parámetro | Valores | Default |
|---|---|---|
| `paginaAnuncios` | Entero `>= 1` | 1 |
| `limiteAnuncios` | `10`, `20`, `50` | 20 |
| `paginaValoraciones` | Entero `>= 1` | 1 |
| `limiteValoraciones` | `10`, `20`, `50` | 20 |

Rules:

- Cada listado conserva su página y tamaño de forma independiente.
- Cambiar un tamaño vuelve a la primera página de ese listado.
- La página fuera de rango se corrige a la última disponible solo tras una carga correcta.
- La URL puede compartirse y recargarse.

## 4. Valoraciones

Cada valoración muestra:

- Autor con enlace a `/usuarios/:id`.
- Puntuación.
- Comentario si existe.
- Fecha.

Rules:

- Sin valoraciones: estado vacío específico.
- La lista no ofrece crear, editar ni eliminar.
- La acción de valorar pertenece a 009.

## 5. Anuncios

Cada tarjeta muestra:

- Imagen o marcador.
- Título, precio, categoría, estado y fecha.
- Enlace al detalle.

Rules:

- Incluye anuncios vendidos con su estado.
- Sin anuncios: estado vacío específico.
- No se ofrecen acciones de gestión.
- Si el anuncio ya no existe, el detalle muestra no encontrado.

## 6. Estados

| Estado | Representación |
|---|---|
| `loading` | Indicador de carga |
| `success` | Datos y listados |
| `empty` | Sin valoraciones o sin anuncios |
| `notfound` | Perfil no encontrado |
| `error` | Mensaje comprensible y reintento |

Rules:

- Los estados vacíos de cada listado son independientes.
- Un error de un listado no oculta los datos del perfil.
- `empty` y `error` son distintos.

## 7. Error Handling

| Status | Handling |
|---|---|
| `400` | Identificador o página inválidos |
| `401` | Limpiar sesión si afecta a datos privados |
| `404` | Perfil o usuario no encontrado |
| `5xx` / red | Error comprensible y reintento |

## 8. Accesibilidad

- Estructura semántica y jerarquía de encabezados.
- Enlaces a perfiles y anuncios accesibles por teclado.
- Foco visible en tema claro y oscuro.
- Paginación con etiquetas.
- Textos alternativos en imágenes.
- Sin desplazamiento horizontal no intencionado a 360 px.

## 9. Out of Scope

- Edición del perfil público.
- Avatar.
- Seguimiento.
- Valoraciones como acción; se especifican en 009.
- Mensajería; se especifica en 007.
- Gestión de anuncios.
- Moderación.
- Cambios en el backend.
