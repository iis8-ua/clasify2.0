# Historia 13 - Perfil propio

> **Prioridad:** Obligatoria  
> **Depende de:** Historia 02 - Inicio de sesión  
> **Endpoints principales:** `GET /usuarios/me`, `PATCH /usuarios/me`, `GET /usuarios/me/anuncios`

#### Historia de usuario: Como usuario autenticado, quiero consultar y editar mi perfil, para mantener mis datos actualizados y revisar los anuncios que he publicado.

#### Especificación (spec)

El usuario autenticado puede abrir su perfil desde la cabecera. La vista solicita
`GET /usuarios/me` y muestra el nombre, el email, la biografía, la fecha de alta y el resumen de
valoraciones. El email es visible solo para el propio usuario y no se puede modificar en esta
versión.

El formulario de edición permite cambiar el nombre y la biografía. También permite cambiar la
contraseña, para lo cual debe solicitar la contraseña actual y la nueva. La nueva contraseña debe
tener al menos ocho caracteres. El frontend valida estos requisitos antes de enviar, pero la
validación definitiva corresponde al backend. Si el usuario intenta enviar un email, el backend
responde con un error y el frontend debe impedirlo desde la interfaz.

La vista incluye un acceso a los anuncios publicados por el usuario mediante
`GET /usuarios/me/anuncios`, que devuelve un listado paginado con el mismo formato que el listado
general. Cada anuncio debe permitir abrir su detalle y, si el usuario es su autor, acceder a las
acciones de gestión.

Tras guardar correctamente, el frontend actualiza el usuario del estado compartido y muestra una
confirmación. Si la contraseña actual no es correcta, se muestra el error sin perder el resto de
datos. Si el token caduca, se limpia la sesión. Esta historia forma parte del alcance acordado.

#### Criterios de aceptación

- La vista de perfil solo es accesible para usuarios autenticados.
- La vista solicita `GET /clasify_api/usuarios/me`.
- La vista muestra nombre, email, biografía, fecha de alta y resumen de valoraciones.
- El email se muestra solo al propio usuario y no se puede editar.
- El formulario permite editar nombre y biografía.
- El formulario permite cambiar la contraseña solicitando la contraseña actual.
- La nueva contraseña debe tener al menos ocho caracteres.
- Un cambio correcto actualiza el usuario del estado compartido.
- Un cambio correcto muestra una confirmación.
- Una contraseña actual incorrecta muestra un error comprensible.
- Un error de validación se muestra en el campo correspondiente.
- La vista permite consultar los anuncios publicados por el usuario.
- El listado de anuncios propios es paginado y permite abrir cada detalle.
- Un `401` limpia la sesión y solicita login.
- El usuario no puede cambiar su email desde el frontend.

#### Contrato del backend

| Aspecto | Detalle |
|---|---|
| Consultar perfil | `GET /clasify_api/usuarios/me` con JWT |
| Respuesta | `200 { "datos": { "usuario": { "id", "email", "nombre", "biografia", "fecha_alta", "valoracion_media", "num_valoraciones" } } }` |
| Editar perfil | `PATCH /clasify_api/usuarios/me` con JWT |
| Cuerpo permitido | `nombre`, `biografia`, `password`, `password_actual` |
| Respuesta de edición | `200 { "datos": { "usuario": { ...perfil actualizado... } } }` |
| Email no editable | `400 { "error": { "codigo": "VALIDACION", "mensaje": "El email no se puede cambiar", "campo": "email" } }` |
| Contraseña incorrecta | `401 { "error": { "codigo": "CREDENCIALES_INVALIDAS", "mensaje": "..." } }` |
| Mis anuncios | `GET /clasify_api/usuarios/me/anuncios?pagina=1&limite=20` con JWT |

#### Estados de interfaz

- Cargando el perfil.
- Perfil con datos.
- Edición sin cambios.
- Edición con cambios.
- Guardado en curso.
- Guardado correcto.
- Error de validación.
- Contraseña actual incorrecta.
- Sesión caducada.
- Listado de anuncios propios con resultados.
- Listado de anuncios propios vacío.
- Error al cargar anuncios propios.

#### Fuera de alcance

- Cambio de email.
- Subida de avatar.
- Eliminación de la cuenta.
- Perfil público de otros usuarios.
- Mensajería y valoraciones.
