# Historias de usuario del frontend

Documentación de referencia para construir el frontend Vue de Clasify contra el backend ya
existente. Estas historias describen únicamente el trabajo del frontend: no autorizan cambios de
API, de base de datos ni de reglas de negocio del backend.

## Alcance vigente

El alcance acordado es **todo el backlog documentado: historias 01 a 16**. Incluye el recorrido
básico y las ampliaciones aprobadas: registro, búsqueda, favoritos, perfil propio, cambio de estado
y Vue Router.

El documento de contexto para Spec Kit es [00-contexto-specs.md](00-contexto-specs.md). Prevalece
sobre las etiquetas de prioridad de las historias cuando haya discrepancia.

| Estado | Historias |
|---|---|
| En alcance | 01–16 |
| Fuera de alcance | Mensajería, valoraciones y perfil público |

## Historias

| Nº | Historia | Archivo | Depende de |
|---|---|---|---|
| 01 | Registro de usuario | [01-registro.md](01-registro.md) | 02 |
| 02 | Inicio de sesión | [02-login.md](02-login.md) | — |
| 03 | Sesión persistente y cierre de sesión | [03-sesion.md](03-sesion.md) | 02 |
| 04 | Listado de anuncios | [04-listado.md](04-listado.md) | — |
| 05 | Detalle de un anuncio | [05-detalle.md](05-detalle.md) | 04 |
| 06 | Creación de un anuncio | [06-crear.md](06-crear.md) | 02, 04 |
| 07 | Edición de un anuncio | [07-editar.md](07-editar.md) | 02, 05 |
| 08 | Cancelación de una edición | [08-cancelar-edicion.md](08-cancelar-edicion.md) | 07 |
| 09 | Eliminación de un anuncio | [09-eliminar.md](09-eliminar.md) | 02, 05 |
| 10 | Paginación del listado | [10-paginacion.md](10-paginacion.md) | 04 |
| 11 | Búsqueda y filtros | [11-busqueda-filtros.md](11-busqueda-filtros.md) | 04, 10 |
| 12 | Favoritos | [12-favoritos.md](12-favoritos.md) | 02, 05 |
| 13 | Perfil propio | [13-perfil.md](13-perfil.md) | 02 |
| 14 | Cambio de estado del anuncio | [14-estado-anuncio.md](14-estado-anuncio.md) | 02, 05 |
| 15 | Navegación con Vue Router | [15-router.md](15-router.md) | 04, 05 |
| 16 | Estados de carga, vacío y error | [16-estados.md](16-estados.md) | 02, 04 |

## Convenciones comunes

- El frontend se implementa con Vue y Pinia.
- La URL base se configura con `VITE_API_URL`. El valor documentado es
  `http://localhost:3000/clasify_api`.
- Las peticiones protegidas usan `Authorization: Bearer <token>`.
- Las respuestas correctas usan `{ datos: ... }`.
- Los listados usan `{ datos: [...], paginacion: { pagina, limite, total, paginas } }`.
- Los errores usan `{ error: { codigo, mensaje, campo } }`; `campo` es opcional.
- El `precio` llega como cadena decimal. El frontend debe tratarlo como valor decimal, no asumir
  que sea un número JSON.
- Las llamadas HTTP se centralizan en servicios. Los componentes no llaman directamente al
  backend.
- El estado compartido de sesión y de listados se gestiona con Pinia.
- Después de crear, editar o eliminar, los datos afectados deben actualizarse sin recargar
  manualmente la página.
- No se debe inventar ningún endpoint ni campo distinto de los documentados en cada historia.

## Usuarios de prueba

El seed del backend crea estos usuarios con la contraseña `Clasify123!`:

| Email | Nombre |
|---|---|
| `ana@example.com` | Ana Ruiz |
| `carlos@example.com` | Carlos Díaz |

También crea ocho categorías y veinticuatro anuncios. Dos están vendidos y, con el límite por
defecto de veinte, el listado tiene dos páginas.

## Fuera de alcance de este backlog

- Mensajería y valoraciones. El backend las ofrece, pero no forman parte del recorrido básico.
- Pagos, envíos, moderación automática y moderación de valoraciones.
- Implementación con React, Svelte o Angular.
- Cambios en el backend, en el esquema de base de datos o en los contratos existentes.

Cualquier funcionalidad adicional debe especificarse aparte y respetar la constitución del
proyecto.
