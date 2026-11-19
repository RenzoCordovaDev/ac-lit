# @ac-base/ac-router

Enrutamiento vanilla por hash con parámetros de ruta (`#/usuarios/:id`), sin dependencias en runtime, pensado para apps construidas con `ac-lit`. Resuelve la ruta actual, avisa a quien se suscriba en cada cambio y expone un Reactive Controller de Lit para que tus componentes lean la ruta sin acoplarse al `hashchange` del navegador.

## Instalación

```bash
pnpm add @ac-base/ac-router
```

`lit` es una **peer dependency** (`^3.0.0`): debe estar instalada en tu app para usar `RouterController`. El núcleo del paquete (matching de rutas, query string, errores) no depende de `lit` en absoluto: `RouterController` solo menciona el tipo del host en su documentación y no importa `lit` en runtime. Si no usas Lit, puedes usar `createRouter()` directamente.

## Conceptos

- **Ruta.** Se define como un objeto `{ path, name }`, por ejemplo `{ path: '/usuarios/:id', name: 'usuario-detalle' }`. El `path` debe empezar con `/` y el `name` no puede estar vacío.
- **Esquema por hash.** Las rutas viven después del `#` (`#/usuarios/42`). No necesitas configurar el servidor: funciona en cualquier host estático.
- **Parámetros.** Un segmento con prefijo `:` es un parámetro que captura cualquier valor no vacío. En `/usuarios/:id`, el segmento `42` de `#/usuarios/42` se guarda como `params.id === '42'`.
- **Primer match gana.** Las rutas se evalúan en el orden en que las registras y se usa la primera que coincide. Si registras una ruta más específica, como `/usuarios/nuevo`, antes que `/usuarios/:id`, la específica gana cuando el path coincide exactamente. Si la pones después, nunca se alcanzará.
- **Query string.** La parte `?clave=valor` se separa del path y se parsea con `URLSearchParams` nativo. Está disponible en `route.query`, y no interviene en el matching.
- **Sin coincidencia.** Si ninguna ruta matchea, `route.matched` es `false` y `route.name` es `undefined`. El router no redirige solo: tú decides el fallback (por ejemplo, mostrar una página de inicio o de error).

## API

### `createRouter(routes)`

Crea una instancia nueva e independiente de Router a partir de un array de rutas `{ path, name }`, **en orden de prioridad** (primer match gana). Devuelve la instancia. Úsala una sola vez por aplicación. Nunca se comparte una instancia global entre apps distintas: cada una debe crear la suya.

```js
import { createRouter } from '@ac-base/ac-router';

export const router = createRouter([
  { path: '/', name: 'home' },
  { path: '/usuarios', name: 'usuarios' },
  { path: '/usuarios/nuevo', name: 'usuario-nuevo' },
  { path: '/usuarios/:id', name: 'usuario-detalle' },
]);
```

Al crearse, el router registra un listener de `hashchange` en `window`, así que debe llamarse en el navegador. Lanza `invalid-routes` si el array está vacío o si alguna ruta no tiene un `path` que empiece con `/` o un `name` no vacío.

### `router.current`

Getter de solo lectura con la ruta actual ya resuelta, con esta forma:

```js
{
  (matched, name, path, params, query);
}
```

Se resuelve al crear el router, así que puedes leerlo de inmediato sin esperar un `hashchange`. Por ejemplo, con `#/usuarios/42?tab=perfil` y las rutas de arriba:

```js
router.current;
// {
//   matched: true,
//   name: 'usuario-detalle',
//   path: '/usuarios/42',
//   params: { id: '42' },
//   query: { tab: 'perfil' }
// }
```

Si ninguna ruta coincide, `matched` es `false`, `name` es `undefined`, `params` es `{}` y `query` sigue reflejando la query string. Leer `current` después de `destroy()` lanza `destroyed`.

### `router.subscribe(callback)`

Registra un callback que recibe el mismo objeto que `router.current` cada vez que la ruta cambia. Devuelve una función que cancela esa suscripción puntual.

```js
const cancelar = router.subscribe(route => {
  console.log(route.name, route.params);
});

cancelar(); // deja de recibir cambios
```

**No se llama de inmediato** al suscribirse. Para el estado inicial, lee `router.current` una vez. Los cambios hechos con `router.navigate()` también notifican a los suscriptores, de forma síncrona.

### `router.navigate(target)`

Navega de dos formas:

```js
// 1. Path literal
router.navigate('/usuarios/42');

// 2. Por nombre de ruta, con params y query opcionales
router.navigate({
  name: 'usuario-detalle',
  params: { id: 42 },
  query: { tab: 'perfil' },
});
// equivale a navegar a '/usuarios/42?tab=perfil'
```

En la forma por nombre, cada `:param` del path se sustituye por el valor de `params`, y `query` se agrega como query string si lo pasas. Los números y booleanos se convierten a texto.

`navigate()` actualiza `location.hash` y avisa a los suscriptores de inmediato, sin depender de que el navegador dispare `hashchange`.

Errores que puede lanzar:

- **Path literal:** no lanza errores propios. Si el path no coincide con ninguna ruta, la navegación ocurre igual y `router.current.matched` será `false`.
- **Por nombre:** `unknown-route-name` si `name` no corresponde a ninguna ruta registrada, y `missing-param` si falta un `:param` (undefined, `null` o string vacío).
- **Cualquier forma:** `destroyed` si la instancia ya fue destruida.

### `router.destroy()`

Quita el listener de `hashchange` y vacía las suscripciones. Después de llamarlo, cualquier operación sobre la instancia (`current`, `subscribe()`, `navigate()`) lanza `destroyed`.

### Códigos de error

Todos los errores son instancias de `RouterError`, con la propiedad `code` (uno de `ROUTER_ERROR_CODES`). Puedes distinguirlos sin leer el mensaje:

```js
import { RouterError, ROUTER_ERROR_CODES } from '@ac-base/ac-router';

try {
  router.navigate({ name: 'usuario-detalle' });
} catch (error) {
  if (error instanceof RouterError && error.code === ROUTER_ERROR_CODES.MISSING_PARAM) {
    // falta el parámetro :id
  }
}
```

| Código (`ROUTER_ERROR_CODES`) | Valor                | Cuándo ocurre                                                                                                 |
| ----------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `INVALID_ROUTES`              | `invalid-routes`     | `createRouter()` con un array vacío o con rutas mal formadas. También `RouterController` sin `config.router`. |
| `UNKNOWN_ROUTE_NAME`          | `unknown-route-name` | `navigate({ name })` con un nombre que no corresponde a ninguna ruta registrada.                              |
| `MISSING_PARAM`               | `missing-param`      | `navigate({ name, params })` cuando falta un `:param` que la ruta requiere.                                   |
| `DESTROYED`                   | `destroyed`          | Cualquier operación sobre una instancia ya destruida con `destroy()`.                                         |

## Integración con Lit (`RouterController`)

`RouterController` es un Reactive Controller de Lit, igual que `ChannelController` de `@ac-base/ac-ccp`. Se engancha a un host (tu componente) y conecta y desconecta su suscripción al router con el ciclo de vida de ese host. Expone `controller.route`, siempre al día, para leerlo directamente en `render()`.

Su configuración acepta `router` (obligatorio) y `onChange` (opcional, se llama en cada cambio de ruta antes de pedir la actualización del host).

Un componente que lee un parámetro de su propia ruta:

```js
// router.js
import { createRouter } from '@ac-base/ac-router';

export const router = createRouter([
  { path: '/', name: 'home' },
  { path: '/usuarios/:id', name: 'usuario-detalle' },
]);
```

```js
// user-detail-page.js
import { LitElement, html } from 'lit';
import { RouterController } from '@ac-base/ac-router';

export class UserDetailPage extends LitElement {
  static properties = {
    router: { attribute: false },
  };

  #routeController;

  willUpdate() {
    // Se crea una sola vez, en cuanto la app asigna el router.
    if (!this.#routeController && this.router) {
      this.#routeController = new RouterController(this, { router: this.router });
    }
  }

  render() {
    if (!this.#routeController) {
      return html`<p>Cargando...</p>`;
    }

    const { matched, name, params } = this.#routeController.route;
    if (!matched || name !== 'usuario-detalle') {
      return html`<p>Página no encontrada.</p>`;
    }

    return html`<h1>Usuario ${params.id}</h1>`;
  }
}

customElements.define('user-detail-page', UserDetailPage);
```

La app asigna la instancia que creó una sola vez con `createRouter()`:

```js
const page = document.querySelector('user-detail-page');
page.router = router;
```

Reglas que conviene tener presentes:

- **Nunca crea su propia instancia de Router.** Siempre recibe la suya en `config.router`, creada una sola vez por la aplicación con `createRouter()`.
- **El ciclo de vida lo maneja el host.** Lee la ruta actual y se suscribe en `hostConnected()`, y cancela la suscripción en `hostDisconnected()`. Reconectar el host no duplica suscripciones.
- **`controller.route` siempre está al día.** Se actualiza en cada cambio, y el host se vuelve a renderizar solo, sin que tengas que llamar a `requestUpdate()`.
- **`controller.navigate(target)` es un atajo de conveniencia.** No agrega estado propio: es equivalente a llamar a `router.navigate(target)`.

## Ejemplo ejecutable

El paquete declara un script para servir una demo en `examples/`, pensada para probar el enrutamiento en el navegador:

```bash
pnpm --filter @ac-base/ac-router run examples:serve
```

La demo tiene tres páginas (home, lista de usuarios y detalle con parámetro de ruta), construidas en vanilla, sin componentes del catálogo.

## Fuera de alcance

- Rutas anidadas.
- Comodín o catch-all (`*`).
- Parámetros opcionales (`:id?`).
- Guards ni redirecciones declarativas: si quieres redirigir, lo haces tú en el callback de `subscribe()` o en tu código de navegación.
- `history.pushState` real (URLs sin `#`): el esquema es siempre por hash.
