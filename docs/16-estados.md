# Historia 16 - Estados de carga, vacío y error

> **Prioridad:** Obligatoria (transversal)  
> **Depende de:** Historias 02 y 04  
> **Endpoints principales:** Todos los usados por las vistas

#### Historia de usuario: Como usuario, quiero entender qué está pasando en cada momento, para distinguir si la aplicación está cargando, no tiene datos o ha fallado.

#### Especificación (spec)

Todas las vistas que realizan operaciones asíncronas deben representar de forma diferenciada los
estados de carga, los resultados, el vacío, el éxito y el error. Un listado vacío no es un error y
un error de carga no debe mostrarse como si no hubiera datos. Las operaciones de escritura deben
mostrar un estado de envío y una confirmación cuando terminan correctamente.

Los errores deben presentarse con mensajes comprensibles. Cuando el backend devuelva
`{ error: { codigo, mensaje, campo } }`, el frontend debe usar `mensaje` para el texto y `campo`
para asociar el error al formulario correspondiente. No deben mostrarse trazas, detalles internos
ni mensajes técnicos sin contexto. Los errores de conexión deben tener un mensaje propio y, cuando
sea posible, una acción de reintento.

La interfaz debe gestionar de forma común los errores `401`, `403`, `404`, `409`, `413` y `5xx`.
Un `401` limpia la sesión y solicita login. Un `403` muestra un error de permisos. Un `404` muestra
un estado de recurso no encontrado. Un `409` muestra un conflicto comprensible. Un `413` indica que
el cuerpo de la petición es demasiado grande. Una imagen que supera el límite se muestra como error
de validación del campo `imagen`, según el contrato del backend. Un `5xx` muestra un mensaje general
sin exponer detalles del servidor.

La accesibilidad debe cuidarse en todos los estados: etiquetas asociadas a campos, mensajes de error
legibles por lectores de pantalla, foco visible, navegación por teclado y textos alternativos en
imágenes. Las acciones destructivas deben pedir confirmación y permitir cancelar.

#### Criterios de aceptación

- Cada vista asíncrona muestra un estado de carga identificable.
- Cada listado distingue entre resultados, vacío y error.
- Cada operación de escritura muestra un estado de envío y evita duplicados.
- Cada operación correcta muestra una confirmación perceptible.
- Los errores de validación se asocian al campo indicado por el backend.
- Los errores de conexión muestran un mensaje comprensible y, si es posible, reintento.
- Un `401` limpia la sesión y solicita login.
- Un `403` muestra un error de permisos.
- Un `404` muestra un recurso no encontrado.
- Un `409` muestra un conflicto comprensible.
- Un `413` muestra un error de cuerpo demasiado grande.
- Una imagen demasiado grande muestra el error de validación del campo `imagen`.
- Un `5xx` muestra un mensaje general sin detalles internos.
- Las acciones destructivas piden confirmación y permiten cancelar.
- Los formularios tienen etiquetas asociadas y errores accesibles.
- La navegación por teclado y el foco visible funcionan en los estados principales.
- Las imágenes tienen texto alternativo o un marcador accesible cuando no existen.
- La interfaz no muestra información privada de otros usuarios en los mensajes de error.

#### Contrato del backend

| Aspecto | Detalle |
|---|---|
| Respuesta correcta | `{ "datos": ... }` o `204` sin cuerpo |
| Error uniforme | `{ "error": { "codigo", "mensaje", "campo" } }` |
| `400` | Validación; usar `campo` cuando exista |
| `401` | Sesión ausente, inválida o caducada |
| `403` | Permisos insuficientes |
| `404` | Recurso no encontrado |
| `409` | Conflicto, por ejemplo email duplicado |
| `413` | Cuerpo de la petición demasiado grande |
| `400` de imagen | La imagen supera el límite o el formato no es válido; `campo: "imagen"` |
| `5xx` | Error interno; mensaje genérico |

#### Estados de interfaz

- Carga inicial.
- Carga de una operación.
- Listado con resultados.
- Listado vacío.
- Operación correcta.
- Error de validación.
- Error de permisos.
- Error de recurso no encontrado.
- Error de conflicto.
- Error de tamaño.
- Error de conexión.
- Error interno.

#### Fuera de alcance

- Monitorización o analítica de errores.
- Traducción a varios idiomas.
- Notificaciones push.
- Sustituir la validación del backend.
