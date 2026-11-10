# Management UI Contract

**Feature**: `004-gestion-anuncios`  
**Date**: 2026-11-10

## 1. Entry Points

| Action | Location | Visibility |
|---|---|---|
| Crear anuncio | Cabecera | Solo autenticados |
| Crear anuncio | Estado vacío de “Mis anuncios” (se conecta en 006) | Solo autenticados |
| Editar | Detalle del anuncio | Solo autor |
| Eliminar | Detalle del anuncio | Solo autor |
| Cambiar estado | Detalle del anuncio | Solo autor |

Rules:

- No se ofrecen acciones de gestión en cada tarjeta del listado general.
- No se ofrecen acciones de gestión en cada tarjeta de la lista de anuncios propios.
- La autorización real la comprueba el backend.
- La acción de crear no se muestra a visitantes.

## 2. AnuncioForm

Un único componente compartido para crear y editar.

Fields:

| Campo | Control | Reglas |
|---|---|---|
| `titulo` | Texto | Obligatorio; máximo 150 |
| `descripcion` | Área de texto | Obligatoria; máximo 5000 |
| `precio` | Texto decimal | Obligatorio; no negativo; máximo 99999999.99; máximo 2 decimales |
| `categoria` | Selector | Obligatoria; catálogo real |
| `imagen` | Archivo | Opcional; JPEG/PNG/WebP; máximo 5 MB |

No existen campos para autor ni estado.

States:

| Estado | Meaning |
|---|---|
| `idle` | Formulario sin interacción |
| `editing` | Formulario con valores |
| `dirty` | Cambios sin guardar |
| `submitting` | Envío en curso |
| `success` | Operación correcta |
| `error` | Error de validación, permisos, conexión o imagen |

Rules:

- El formulario no se envía si hay errores de validación.
- El formulario no se envía dos veces.
- Los errores del backend se asocian al campo `campo`.
- El email del autor no se muestra.
- El formulario es usable con teclado y a 360 px.

## 3. Crear

- Se abre desde la cabecera o el estado vacío de “Mis anuncios”.
- La categoría se carga del catálogo de 003.
- La imagen es opcional y se previsualiza.
- Sin imagen se envía JSON; con imagen, `FormData`.
- Un `201` muestra confirmación y abre el detalle.
- Un error de conexión conserva los datos del formulario.
- Salir con cambios solicita confirmación.

## 4. Editar

- Solo disponible para el autor.
- El formulario se precarga con los valores actuales.
- Solo se envían los campos modificados.
- Si no hay cambios ni imagen nueva, no se envía nada.
- La imagen actual se muestra y puede sustituirse.
- No se puede eliminar la imagen sin subir otra.
- Un `200` actualiza detalle y listado y muestra confirmación.
- Un `403` muestra error de permisos.
- Un `404` muestra anuncio no encontrado.
- Salir con cambios solicita confirmación.

## 5. Cancelar edición

- No realiza ninguna petición.
- Restaura los valores originales.
- Descarta la imagen nueva.
- Si hay cambios, solicita confirmación.
- Si no hay cambios, sale directamente.
- No muestra mensaje de éxito.
- Vuelve al detalle o a la vista de origen.

## 6. Eliminar

- Solo disponible para el autor.
- Solicita confirmación con el título del anuncio.
- Cancelar no elimina ni modifica nada.
- Confirmar envía la eliminación.
- Durante la operación se muestra carga y se impide duplicar.
- Un `204` retira el anuncio y vuelve al listado.
- Un `403` muestra error de permisos.
- Un `404` informa de que el anuncio ya no existe.
- Un fallo de conexión mantiene el anuncio visible.
- El diálogo es accesible por teclado y se puede cerrar sin eliminar.

## 7. Cambiar estado

- Solo disponible para el autor.
- Marcar como vendido solicita confirmación.
- Volver a disponible no solicita confirmación.
- Durante la operación se muestra carga y se impide duplicar.
- Un `200` actualiza detalle y listado.
- Un anuncio vendido desaparece del listado por defecto y sigue accesible por detalle.
- Un anuncio que vuelve a disponible reaparece en el listado por defecto.
- Un `403` muestra error de permisos.
- Un `404` muestra anuncio no encontrado.

## 8. Permissions

| Situation | UI |
|---|---|
| Visitante | No ve acciones de gestión; crear no está disponible |
| Usuario autenticado no autor | No ve editar, eliminar ni cambiar estado |
| Autor | Ve las tres acciones en el detalle |
| Backend devuelve `403` | Error de permisos |

Rules:

- Ocultar no sustituye la comprobación del backend.
- No se muestran datos privados de otros usuarios.

## 9. Error Handling

| Status | Handling |
|---|---|
| `400` | Error de validación por campo |
| `401` de sesión | Limpiar sesión y solicitar acceso |
| `403` | Error de permisos |
| `404` | Anuncio no encontrado |
| `413` | Error de cuerpo demasiado grande |
| Error de imagen | `400` de validación con `campo: "imagen"` |
| Red | Error comprensible y conservación de datos cuando proceda |

Rules:

- No se muestran trazas ni detalles internos.
- Los mensajes están en español.
- Los errores de sesión no confunden al usuario con errores de validación.

## 10. Accessibility

- Etiquetas asociadas a todos los campos.
- Errores accesibles y asociados al campo.
- Foco visible.
- Navegación por teclado.
- Diálogos cerrables con teclado y con retorno de foco.
- Previsualización de imagen con descripción accesible.
- Formularios usables a 360 px sin desplazamiento horizontal no intencionado.

## 11. Out of Scope

- Acciones de gestión en listas.
- Creación desde cada tarjeta.
- Cambio de autor.
- Cambio de estado desde el formulario.
- Varias imágenes.
- Eliminación de imagen sin sustitución.
- Borradores, autoguardado y edición colaborativa.
- Texto enriquecido.
- Acciones masivas.
- Administración de anuncios ajenos.
