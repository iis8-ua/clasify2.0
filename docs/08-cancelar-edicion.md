# Historia 08 - Cancelación de una edición

> **Prioridad:** Obligatoria  
> **Depende de:** Historia 07 - Edición de un anuncio  
> **Endpoint principal:** Ninguno; la cancelación es local

#### Historia de usuario: Como autor de un anuncio, quiero cancelar la edición sin guardar los cambios, para dejar el anuncio exactamente como estaba.

#### Especificación (spec)

Mientras el formulario de edición está abierto, el autor puede cancelar la operación. La
cancelación debe ser una acción local: no debe enviar ninguna petición al backend, no debe
modificar el anuncio y no debe alterar el listado ni el estado compartido.

Al cancelar, el frontend debe descartar los cambios introducidos, restaurar los valores originales
del anuncio y salir del modo de edición. Si el usuario había modificado algún campo o había
seleccionado una imagen nueva, se le debe pedir confirmación antes de descartar los cambios. Si no
había cambios, puede salir directamente sin confirmación.

Después de cancelar, el usuario vuelve al detalle del anuncio o a la vista desde la que abrió la
edición. La interfaz debe mostrar los valores originales, sin errores de validación pendientes y
sin mensajes de éxito de una edición que no se ha realizado.

#### Criterios de aceptación

- La vista de edición ofrece una acción de cancelar.
- Cancelar no envía ninguna petición al backend.
- Cancelar no modifica el anuncio en el backend.
- Cancelar restaura los valores originales del formulario.
- Cancelar descarta la imagen nueva seleccionada.
- Si hay cambios sin guardar, se solicita confirmación antes de descartarlos.
- Si no hay cambios, se puede cancelar sin confirmación adicional.
- Cancelar elimina los errores de validación pendientes.
- Cancelar no muestra un mensaje de edición correcta.
- Después de cancelar, el detalle y el listado mantienen los datos anteriores.
- Después de cancelar, el usuario vuelve al detalle o a la vista de origen.

#### Contrato del backend

| Aspecto | Detalle |
|---|---|
| Endpoint | Ninguno |
| Petición | No se realiza ninguna petición |
| Estado afectado | Solo el estado local del formulario y de la vista |
| Datos persistentes | No se modifican |

#### Estados de interfaz

- Edición sin cambios.
- Edición con cambios sin guardar.
- Confirmación de descarte.
- Cancelación completada.

#### Fuera de alcance

- Guardar cambios parciales.
- Cancelar una creación ya enviada.
- Deshacer una edición después de guardarla.
