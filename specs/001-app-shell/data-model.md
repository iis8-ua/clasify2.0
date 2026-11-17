# Data Model: Estructura común y navegación del frontend

**Feature**: `001-app-shell`  
**Date**: 2026-11-10

## Overview

Esta feature no incorpora datos de negocio persistidos. Su modelo describe los contratos de
presentación que las vistas y componentes comparten: rutas, entradas de navegación, estados de
interfaz, resumen de sesión y tokens visuales.

## Entities

### Ruta

Representa una dirección navegable de la aplicación.

| Campo | Tipo | Reglas |
|---|---|---|
| `path` | string | Único, comienza por `/`; `/anuncios/nuevo` se declara antes de `/anuncios/:id` |
| `name` | string | Único y estable; se usa para navegación programática |
| `title` | string | No vacío; se muestra en el título de la página |
| `access` | `public` \| `protected` | Determina si requiere sesión |
| `view` | componente | Vista asociada |
| `placeholder` | boolean | Se conserva por compatibilidad; las rutas de la Práctica 4 usan vistas reales |

Rutas finales:

| Path | Name | Access | Vista |
|---|---|---|---|
| `/` | `anuncios` | Pública | `AnunciosListView` |
| `/anuncios/:id` | `anuncio-detalle` | Pública | `AnuncioDetalleView` |
| `/login` | `login` | Pública; redirige si hay sesión | `LoginView` |
| `/registro` | `registro` | Pública; redirige si hay sesión | `RegisterView` |
| `/anuncios/nuevo` | `anuncio-crear` | Protegida | `AnuncioCrearView` |
| `/anuncios/:id/editar` | `anuncio-editar` | Protegida | `AnuncioEditarView` |
| `/favoritos` | `favoritos` | Protegida | `FavoritosView` |
| `/perfil` | `perfil` | Protegida | `PerfilView` |
| `/:pathMatch(.*)*` | `no-encontrado` | Pública | `NotFoundView` |

### Elemento de navegación

Representa una entrada visible de la cabecera.

| Campo | Tipo | Reglas |
|---|---|---|
| `label` | string | Texto en español |
| `routeName` | string | Debe existir en la tabla de rutas |
| `visibility` | `public` \| `authenticated` | Controla si se muestra al visitante o solo con sesión |
| `order` | number | Orden estable en la cabecera |
| `primary` | boolean | Identifica la acción principal de creación |

Entradas previstas:

| Label | Route name | Visibility | Primary |
|---|---|---|---|
| Anuncios | `anuncios` | Pública | No |
| Favoritos | `favoritos` | Autenticada | No |
| Perfil | `perfil` | Autenticada | No |
| Publicar anuncio | `anuncio-crear` | Autenticada | Sí |
| Iniciar sesión | `login` | Pública sin sesión | No |
| Registrarse | `registro` | Pública sin sesión | No |

La cabecera muestra la identidad del usuario cuando hay sesión y las acciones de acceso cuando no
la hay. La acción de favorito del detalle no forma parte de la navegación global.

### Vista

Representa una pantalla real montada por una ruta.

| Campo | Tipo | Reglas |
|---|---|---|
| `routeName` | string | Referencia a una ruta existente |
| `title` | string | Título descriptivo de la página |
| `state` | `EstadoInterfaz` | Estado actual de la vista |
| `placeholder` | boolean | Verdadero mientras no exista la vista de negocio |

### EstadoInterfaz

Representa una situación visual común.

| Campo | Tipo | Reglas |
|---|---|---|
| `type` | `loading` \| `empty` \| `error` \| `validation` \| `permission` \| `success` | Valor cerrado |
| `message` | string | En español y comprensible |
| `fieldErrors` | map<string, string> | Solo para `validation`; claves de campo |
| `retryable` | boolean | Muestra acción de reintento cuando proceda |
| `actionLabel` | string \| null | Texto de la acción principal, si existe |

Reglas:

- `empty` no se representa nunca como `error`.
- `error` no muestra trazas, códigos internos ni detalles técnicos.
- `validation` asocia cada mensaje al campo correspondiente.
- `permission` explica que la acción no está permitida.
- `success` es perceptible y no bloquea la interfaz.
- `loading` impide acciones duplicadas cuando corresponda.

### SessionSnapshot

Resumen de sesión que consume la cabecera. En esta feature es una frontera de presentación; la
spec 002 implementa el registro, acceso, restauración y cierre reales.

| Campo | Tipo | Reglas |
|---|---|---|
| `isAuthenticated` | boolean | `false` por defecto en la base del shell |
| `displayName` | string \| null | Nombre visible del usuario; `null` sin sesión |
| `canCreate` | boolean | Derivado de `isAuthenticated` |

La store de sesión de 001 solo expone esta instantánea y los métodos de establecimiento y limpieza
necesarios para que la cabecera reaccione. No implementa login, registro, logout ni llamadas al
backend.

### ThemeTokens

Tokens visuales compartidos.

| Grupo | Campos |
|---|---|
| Color | `primary`, `primaryContrast`, `surface`, `surfaceAlt`, `text`, `textMuted`, `border`, `danger`, `success`, `warning` |
| Tipografía | `fontFamily`, `fontSizeBase`, `fontSizeSmall`, `fontSizeHeading`, `fontWeightRegular`, `fontWeightStrong` |
| Espaciado | `space1`, `space2`, `space3`, `space4`, `space5`, `space6` |
| Forma | `radiusSmall`, `radiusMedium`, `radiusLarge`, `shadowSmall`, `shadowMedium` |
| Layout | `maxContentWidth`, `headerHeight`, `breakpointMobile` |

Reglas:

- Existen tema claro y tema oscuro.
- Cada token de color, superficie, texto y borde tiene valor en ambos temas.
- El tema claro es el valor inicial si no hay preferencia guardada.
- La preferencia de tema se guarda en `localStorage` y no contiene datos privados.
- El color de acento se usa para acciones principales y foco.
- Los contrastes deben ser legibles en ambos temas.

### Confirmación

Representa una decisión del usuario antes de una acción destructiva.

| Campo | Tipo | Reglas |
|---|---|---|
| `open` | boolean | Controla la visibilidad |
| `title` | string | Identifica la acción |
| `message` | string | Explica la consecuencia |
| `confirmLabel` | string | Acción afirmativa |
| `cancelLabel` | string | Acción de cancelación |
| `onConfirm` | función | Se ejecuta solo al confirmar |
| `onCancel` | función | Cierra sin ejecutar |

## State Transitions

### Vista asíncrona

```text
loading -> success
loading -> empty
loading -> error
error -> loading          (reintento)
```

### Confirmación

```text
closed -> open
open -> confirmed         (ejecuta la acción)
open -> cancelled         (no ejecuta la acción)
```

### Sesión de presentación

```text
unknown -> visitor         (sin sesión)
unknown -> authenticated   (sesión restaurada por la spec 002)
visitor -> authenticated
authenticated -> visitor   (cierre de sesión)
```

En 001, `unknown` se resuelve como `visitor` hasta que la spec 002 implemente la restauración.

## Validation Rules

- `path` y `name` de ruta son únicos.
- Toda entrada de navegación referencia una ruta existente.
- Las rutas protegidas no se muestran como accesibles para un visitante.
- La acción de creación solo se muestra con sesión.
- La acción de favorito no se incluye en la navegación global.
- Toda vista tiene un título descriptivo.
- La ruta catch-all se declara al final.
- Las rutas de creación y edición se declaran antes de la ruta dinámica de detalle cuando puedan
  colisionar.
- Los estados usan valores cerrados y mensajes en español.
- Los errores no exponen detalles internos.
- Los tokens incluyen variantes de tema claro y oscuro.

## Relationships

- Una `Ruta` tiene una `Vista`.
- Una `Vista` tiene un `EstadoInterfaz` activo.
- Una `Ruta` puede aparecer en cero o más `ElementoNavegacion`.
- La cabecera consume un `SessionSnapshot` y la lista de `ElementoNavegacion`.
- Las acciones destructivas usan una `Confirmación`.
- El tema se aplica globalmente mediante `ThemeTokens`.
