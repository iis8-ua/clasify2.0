# Historia 02 - Inicio de sesión

> **Prioridad:** Obligatoria  
> **Depende de:** Ninguna  
> **Endpoint principal:** `POST /clasify_api/auth/login`

#### Historia de usuario: Como visitante, quiero iniciar sesión con mi email y mi contraseña, para acceder a las acciones reservadas a usuarios autenticados.

#### Especificación (spec)

El visitante puede consultar el listado y el detalle de los anuncios sin autenticarse. Cuando
intenta realizar una acción protegida, como crear, editar o eliminar un anuncio, el frontend debe
solicitarle el inicio de sesión. También debe existir una entrada visible al formulario de login
desde la cabecera o desde la pantalla principal.

El formulario solicita email y contraseña. Ambos campos son obligatorios y el email debe tener
formato válido. Al enviar, se muestra un estado de carga y se deshabilita el botón para evitar
envíos duplicados. Si las credenciales son incorrectas, se muestra un mensaje general sin revelar
si el email existe o no. Si la petición falla por conexión, se muestra un error comprensible y se
conservan los datos introducidos.

Si el login es correcto, el frontend guarda el token y el usuario devueltos por el backend,
actualiza el estado compartido de sesión y redirige al usuario a la vista que pretendía abrir o, si
no había una vista pendiente, al listado de anuncios. La interfaz debe reflejar inmediatamente que
el usuario está autenticado y debe mostrar únicamente las acciones permitidas.

#### Criterios de aceptación

- El formulario de login contiene los campos `email` y `password`.
- Ambos campos son obligatorios y el email se valida con formato válido antes de enviar.
- Durante el envío se muestra un estado de carga y se impide un segundo envío.
- Un login correcto devuelve `200`, guarda el token y el usuario, y actualiza el estado compartido.
- Un login correcto redirige a la vista solicitada o al listado si no había ninguna pendiente.
- Unas credenciales incorrectas muestran un mensaje general y no revelan si el email existe.
- Un error de validación muestra el mensaje asociado al campo indicado por el backend.
- Un error de conexión se muestra como un error general sin borrar el email introducido.
- La cabecera o la interfaz principal muestran la entrada de login cuando no hay sesión.
- La interfaz muestra el nombre o identificador del usuario cuando hay sesión iniciada.
- Las acciones protegidas no se muestran como disponibles para un visitante.

#### Contrato del backend

| Aspecto | Detalle |
|---|---|
| Método y ruta | `POST /clasify_api/auth/login` |
| Autenticación | No requiere token |
| Cuerpo | `{ "email": "ana@example.com", "password": "Clasify123!" }` |
| Respuesta correcta | `200 { "datos": { "token": "...", "usuario": { "id", "email", "nombre" } } }` |
| Credenciales incorrectas | `401 { "error": { "codigo": "CREDENCIALES_INVALIDAS", "mensaje": "..." } }` |
| Error de validación | `400 { "error": { "codigo": "VALIDACION", "mensaje": "...", "campo": "..." } }` |

#### Estados de interfaz

- Formulario vacío.
- Formulario con errores de validación.
- Envío en curso.
- Login correcto.
- Credenciales incorrectas.
- Error de conexión o error interno.

#### Fuera de alcance

- Registro de usuario, que se documenta en la historia 01.
- Recuperación de contraseña.
- Inicio de sesión con proveedores externos.
- Renovación automática del token mediante refresh token.
