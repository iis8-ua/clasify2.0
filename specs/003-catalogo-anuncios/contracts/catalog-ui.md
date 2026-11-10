# Catalog UI Contract

**Feature**: `003-catalogo-anuncios`  
**Date**: 2026-11-10

## 1. URL Query Contract

| Parameter | Values | Default | Behavior |
|---|---|---|---|
| `texto` | Texto libre, máximo 150 | Vacío | Se aplica al enviar la búsqueda o pulsar Enter |
| `categoria` | Identificador de categoría | Sin filtro | Se aplica al cambiar el selector |
| `estado` | `disponible`, `vendido`, `todos` | `disponible` | Se aplica al cambiar el selector |
| `orden` | `fecha_desc`, `fecha_asc`, `precio_desc`, `precio_asc` | `fecha_desc` | Se aplica al cambiar el selector |
| `pagina` | Entero `>= 1` | `1` | Se aplica al cambiar de página |

Rules:

- `limite` no se incluye en la URL; es fijo en 20.
- Al cambiar un filtro se vuelve a `pagina=1`.
- Al cambiar de página se conservan los filtros.
- Los valores inválidos se normalizan a los valores por defecto.
- La URL debe poder compartirse y recargarse.
- La página fuera de rango se corrige a la última disponible.

## 2. Listado

Cada `AnuncioCard` muestra:

| Elemento | Regla |
|---|---|
| Imagen | Diferida; marcador accesible si no existe |
| Título | Texto visible |
| Precio | Formateado en EUR/es-ES |
| Categoría | Nombre resuelto desde el catálogo |
| Estado | Distintivo disponible/vendido |
| Fecha | Formateada en español |
| Enlace | Abre el detalle; accesible por teclado |

No se muestra el nombre del autor en el listado.

Rules:

- El listado puede ser público.
- El listado inicial muestra anuncios disponibles, por fecha descendente y 20 por página.
- La tarjeta completa es un enlace o contiene un enlace accesible.
- El estado vendido se muestra cuando el filtro lo permite.
- La imagen no debe romper el layout si tarda o falla.

## 3. Detalle

La vista muestra:

| Elemento | Regla |
|---|---|
| Título | Visible |
| Descripción | Texto completo |
| Precio | EUR/es-ES |
| Estado | Distintivo visible |
| Imagen | Prioritaria; marcador si no existe |
| Fecha | Formateada en español |
| Categoría | Nombre real |
| Autor | Nombre, biografía y resumen de valoraciones |
| Email del autor | No se muestra |
| Número de favoritos | Informativo |
| Estado de favorito | Informativo; sin acción en 003 |

Rules:

- No se muestran acciones de edición, eliminación, cambio de estado ni favoritos.
- El detalle es público.
- El detalle se puede abrir por URL directa.
- Volver al listado conserva página y filtros.
- El identificador inválido y el anuncio inexistente tienen estados distintos.

## 4. Paginación

Controls:

- Primera página.
- Página anterior.
- Página actual y total.
- Página siguiente.
- Última página.

Rules:

- Los controles se deshabilitan en los extremos.
- La página actual se muestra de forma comprensible.
- La paginación conserva filtros y orden.
- La paginación se usa con teclado.
- No hay selector de tamaño de página.
- No hay paginación infinita.

## 5. Estados

| Estado | Representación |
|---|---|
| loading | Indicador de carga |
| success | Listado o detalle con datos |
| empty | Sin resultados, con explicación |
| error | Mensaje comprensible y reintento |
| notfound | Anuncio no encontrado |
| invalid | Identificador inválido |

Rules:

- `empty` y `error` son distintos.
- `notfound` y `invalid` son distintos.
- Los errores no exponen detalles técnicos.
- La búsqueda sin coincidencias tiene un mensaje específico.

## 6. Búsqueda y filtros

- La búsqueda se aplica al enviar o pulsar Enter.
- Los filtros de categoría, estado y orden se aplican al cambiar.
- La interfaz indica los filtros activos.
- Existe una acción para limpiar filtros.
- Limpiar filtros vuelve al listado por defecto y a página 1.
- El texto máximo es 150 caracteres.
- La búsqueda no distingue mayúsculas, minúsculas ni acentos porque el backend lo resuelve.

## 7. Accesibilidad

- Tarjetas y enlaces accesibles por teclado.
- Foco visible.
- Etiquetas en filtros y paginación.
- Textos alternativos en imágenes.
- Mensajes de estado legibles por lectores de pantalla.
- Sin desplazamiento horizontal no intencionado a 360 px.
- Jerarquía de encabezados comprensible.

## 8. Error Mapping

| Status | Handling |
|---|---|
| `400` | Error de validación; mostrar campo |
| `404` | Estado de no encontrado en detalle |
| `5xx` / red | Error comprensible con reintento |
| Página fuera de rango | Corregir a la última página |

## 9. Out of Scope

- Crear, editar, eliminar o cambiar estado.
- Añadir o quitar favoritos.
- Acciones de autor en el detalle.
- Búsqueda en otros recursos.
- Filtros por precio.
- Mapa, recomendaciones e historial.
- Selector de tamaño de página.
- Paginación infinita.
- Modo oscuro.
- Cambios en el backend.
