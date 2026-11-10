# Historia 01 - Registro de usuario

> **Prioridad:** Obligatoria  
> **Depende de:** Historia 02 - Inicio de sesión  
> **Endpoint principal:** `POST /clasify_api/auth/register`

#### Historia de usuario: Como visitante, quiero crear una cuenta con mi email, mi nombre y una contraseña, para poder iniciar sesión y publicar anuncios.

#### Especificación (spec)

El visitante accede al formulario de registro desde la pantalla de inicio de sesión. Debe indicar
un email, un nombre y una contraseña. El formulario valida en el cliente que el email tiene formato
válido, que el nombre no está vacío y que la contraseña tiene al menos ocho caracteres. La
validación del frontend es una ayuda para el usuario, pero la validez definitiva la determina el
backend.

Al enviar el formulario se muestra un estado de carga y se impide un segundo envío mientras la
petición está en curso. Si el registro es correcto, el backend devuelve un token y los datos del
usuario. El frontend guarda la sesión, actualiza el estado compartido y lleva al usuario al
listado de anuncios. Si el email ya existe, se muestra el conflicto asociado al campo `email`. Si
algún dato no es válido, se muestran los errores devueltos por el backend junto a los campos
correspondientes.

Esta historia forma parte del alcance acordado. El frontend debe permitir iniciar sesión con los
usuarios de prueba del seed además de ofrecer el registro.

#### Criterios de aceptación

- El visitante puede abrir el formulario de registro desde la pantalla de inicio de sesión.
- El formulario contiene los campos `email`, `nombre` y `password`.
- El formulario impide el envío si faltan campos obligatorios o si el email no tiene formato válido.
- El nombre no puede superar los 100 caracteres.
- El formulario impide el envío si la contraseña tiene menos de ocho caracteres.
- Durante el envío se muestra un estado de carga y se deshabilita el botón de registro.
- Un registro correcto devuelve `201`, guarda el token y el usuario, y redirige al listado.
- Un email duplicado muestra un mensaje comprensible asociado al campo `email`.
- Un error de validación muestra el mensaje del backend en el campo indicado por `campo`.
- Un error de conexión se muestra como un error general, sin perder los datos introducidos.
- El formulario ofrece un enlace para volver al inicio de sesión.
- La sesión iniciada tras el registro se refleja en el estado compartido y en la interfaz.

#### Contrato del backend

| Aspecto | Detalle |
|---|---|
| Método y ruta | `POST /clasify_api/auth/register` |
| Autenticación | No requiere token |
| Cuerpo | `{ "email": "usuario@example.com", "nombre": "Nombre", "password": "Clasify123!" }` |
| Respuesta correcta | `201 { "datos": { "token": "...", "usuario": { "id", "email", "nombre" } } }` |
| Error de validación | `400 { "error": { "codigo": "VALIDACION", "mensaje": "...", "campo": "..." } }` |
| Email duplicado | `409 { "error": { "codigo": "EMAIL_DUPLICADO", "mensaje": "...", "campo": "email" } }` |

#### Estados de interfaz

- Formulario vacío.
- Formulario con errores de validación.
- Envío en curso.
- Registro correcto.
- Error de email duplicado.
- Error de conexión o error interno.

#### Fuera de alcance

- Confirmación por email.
- Recuperación de contraseña.
- Inicio de sesión con proveedores externos.
- Cambio de email después del registro.
