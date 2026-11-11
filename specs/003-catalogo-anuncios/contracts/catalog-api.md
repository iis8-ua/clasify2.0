# Catalog API Contract

**Feature**: `003-catalogo-anuncios`  
**Date**: 2026-11-10

## Base

| Aspecto | Valor |
|---|---|
| URL base | `VITE_API_URL` (`http://localhost:3000/clasify_api`) |
| Formato | JSON |
| Autenticación de listado | No |
| Autenticación de detalle | Opcional |
| Error uniforme | `{ "error": { "codigo", "mensaje", "campo" } }` |

## 1. Listado

```text
GET /anuncios?texto=&categoria=&estado=&orden=&pagina=&limite=
```

Query:

| Parámetro | Tipo | Valores | Default |
|---|---|---|---|
| `texto` | string | Texto libre, máximo 150 | Vacío |
| `categoria` | number | Identificador positivo | Sin filtro |
| `estado` | string | `disponible`, `vendido`, `todos` | `disponible` |
| `orden` | string | `fecha_desc`, `fecha_asc`, `precio_desc`, `precio_asc` | `fecha_desc` |
| `pagina` | number | Entero `>= 1` | `1` |
| `limite` | number | `10`, `20` o `50` desde la interfaz; backend admite 1–100 | `20` |

Success `200`:

```json
{
  "datos": [
    {
      "id": 1,
      "titulo": "Bicicleta de montaña",
      "precio": "250.00",
      "estado": "disponible",
      "imagen": "archivo.jpg",
      "fecha_creacion": "2026-11-08T10:00:00.000Z",
      "id_categoria": 8,
      "id_autor": 1
    }
  ],
  "paginacion": {
    "pagina": 1,
    "limite": 20,
    "total": 24,
    "paginas": 2
  }
}
```

Rules:

- `precio` llega como cadena decimal.
- El listado no incluye nombre de autor ni nombre de categoría.
- `imagen` puede ser `null`.
- La página fuera de rango devuelve `datos` vacío y la paginación real; el frontend corrige a la
  última página solo tras una carga correcta.
- Las secciones de similares usan `limite=4` y filtran el anuncio actual en el cliente.
- Un error de validación devuelve `400` con `campo`.

## 2. Detalle

```text
GET /anuncios/:id
Authorization: Bearer <token>   (opcional)
```

Success `200`:

```json
{
  "datos": {
    "anuncio": {
      "id": 1,
      "titulo": "Bicicleta de montaña",
      "descripcion": "Bicicleta de 29 pulgadas...",
      "precio": "250.00",
      "estado": "disponible",
      "imagen": "archivo.jpg",
      "fecha_creacion": "2026-11-08T10:00:00.000Z",
      "autor": {
        "id": 1,
        "nombre": "Ana Ruiz",
        "biografia": "Perfil de prueba.",
        "fecha_alta": "2026-11-10T09:00:00.000Z",
        "valoracion_media": null,
        "num_valoraciones": 0
      },
      "categoria": {
        "id": 8,
        "nombre": "Bicicletas"
      },
      "num_favoritos": 0,
      "es_favorito": false
    }
  }
}
```

El backend devuelve `autor.id` y `categoria.id` anidados. El frontend deriva `id_autor` e
`id_categoria` en `anunciosService` para que las acciones de autoría no dependan de campos planos.

Errors:

| Status | Code | Handling |
|---|---|---|
| `400` | `VALIDACION` | Identificador inválido |
| `404` | `NO_ENCONTRADO` | Estado de anuncio no encontrado |

Rules:

- Sin token, `es_favorito` es `false`.
- El email del autor no se incluye.
- Los campos de conversación no forman parte de esta feature y se ignoran.
- El detalle no ofrece acciones de edición, eliminación, estado ni favoritos.
- Los similares se obtienen del listado con la categoría del anuncio y `estado=disponible`.
- Más del vendedor se obtiene de `/usuarios/:autorId/anuncios` y se filtra a disponibles.
- El detalle enlaza al perfil público de 008.

## 3. Anuncios por usuario

```text
GET /usuarios/:id/anuncios?pagina=1&limite=4
```

Se usa para “Más de este vendedor” y para el listado del perfil público de 008.

Success `200`: sobre paginado con los mismos campos del listado.

Rules:

- El listado es público.
- Incluye anuncios vendidos; la sección del detalle filtra solo disponibles.
- El frontend excluye el anuncio actual y limita la sección a 4 elementos.
- El identificador de usuario inexistente devuelve `404`.

## 4. Categorías

```text
GET /categorias?pagina=1&limite=100
```

Success `200`:

```json
{
  "datos": [
    { "id": 8, "nombre": "Bicicletas" }
  ],
  "paginacion": {
    "pagina": 1,
    "limite": 100,
    "total": 8,
    "paginas": 1
  }
}
```

Rules:

- Se cargan todas las categorías para el mapa `id → nombre`.
- Si `paginas > 1`, se recorren las páginas restantes.
- No se codifican categorías en el frontend.
- La lista de categorías es pública.

## 5. Imágenes

| Aspecto | Valor |
|---|---|
| URL | `VITE_API_URL` + `/uploads/` + `imagen` |
| Imagen ausente | `imagen` es `null`; se muestra marcador accesible |
| Carga en listado | Diferida |
| Carga en detalle | Prioritaria |
| Texto alternativo | Describe el contenido o indica ausencia |

## 6. Out of Scope

- Crear, editar, eliminar o cambiar estado.
- Añadir o quitar favoritos.
- Filtros por rango de precio.
- Búsqueda en otros recursos.
- Mapa, recomendaciones o búsquedas guardadas.
- Modificaciones del backend.
