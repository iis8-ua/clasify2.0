# Historia 03 - Sesión persistente y cierre de sesión

> **Prioridad:** Obligatoria  
> **Depende de:** Historia 02 - Inicio de sesión  
> **Endpoint principal:** `GET /clasify_api/auth/yo`

#### Historia de usuario: Como usuario autenticado, quiero que mi sesión se recupere al recargar la página y poder cerrarla cuando termine, para no tener que iniciar sesión constantemente y para dejar de mostrar información privada.

#### Especificación (spec)

El backend emite un JWT stateless y no dispone de endpoint de logout ni de lista negra de tokens.
Por tanto, la persistencia y el cierre de sesión son responsabilidad del frontend.

Al arrancar la aplicación, si existe un token guardado, el frontend debe solicitar
`GET /auth/yo` para comprobar que sigue siendo válido y recuperar el perfil del usuario. Mientras
se comprueba la sesión, la interfaz debe mostrar un estado de carga razonable y no debe mostrar
acciones protegidas como si el usuario estuviera autenticado. Si el token ha caducado, es inválido
o el usuario ya no existe, el frontend debe eliminar la sesión y continuar como visitante.

El cierre de sesión debe eliminar el token y todos los datos privados del usuario de los stores:
usuario autenticado, listados privados, favoritos, borradores y cualquier información que no deba
permanecer visible. Después del cierre, la interfaz debe mostrar únicamente el contenido público y
redirigir al listado o a la pantalla de inicio de sesión.

Cuando cualquier petición protegida devuelva `401`, el frontend debe tratar la sesión como
inválida, limpiar el estado privado y solicitar un nuevo inicio de sesión.

#### Criterios de aceptación

- Al recargar la aplicación con un token guardado, se solicita `GET /auth/yo`.
- Durante la comprobación de la sesión se muestra un estado de carga y no se habilitan acciones
  protegidas de forma prematura.
- Si `GET /auth/yo` responde correctamente, el usuario y su sesión se restauran en el estado
  compartido.
- Si `GET /auth/yo` responde `401`, se elimina el token y la aplicación continúa como visitante.
- El cierre de sesión elimina el token del almacenamiento utilizado.
- El cierre de sesión limpia el usuario autenticado y todos los datos privados de los stores.
- Después del cierre de sesión, la interfaz no muestra información privada del usuario anterior.
- Después del cierre de sesión, las acciones protegidas vuelven a solicitar login.
- Un `401` en cualquier petición protegida limpia la sesión y muestra un mensaje comprensible.
- La aplicación no intenta inventar ni llamar a un endpoint de logout inexistente.

#### Contrato del backend

| Aspecto | Detalle |
|---|---|
| Método y ruta | `GET /clasify_api/auth/yo` |
| Autenticación | `Authorization: Bearer <token>` |
| Respuesta correcta | `200 { "datos": { "usuario": { "id", "email", "nombre", "biografia", "fecha_alta", "valoracion_media", "num_valoraciones" } } }` |
| Token ausente | `401 { "error": { "codigo": "SIN_TOKEN", "mensaje": "..." } }` |
| Token inválido | `401 { "error": { "codigo": "TOKEN_INVALIDO", "mensaje": "..." } }` |
| Token caducado | `401 { "error": { "codigo": "TOKEN_CADUCADO", "mensaje": "..." } }` |
| Usuario eliminado | `401 { "error": { "codigo": "USUARIO_NO_EXISTE", "mensaje": "..." } }` |

#### Estados de interfaz

- Comprobando sesión.
- Sesión válida.
- Visitante sin token.
- Sesión caducada o inválida.
- Cierre de sesión correcto.

#### Fuera de alcance

- Renovación automática del token.
- Logout en el servidor.
- Lista negra de tokens.
- Recordar la sesión entre dispositivos.
