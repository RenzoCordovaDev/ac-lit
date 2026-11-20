# __title__

Proyecto generado con `aclit app:create __package_name__`. Es una app propia construida con los componentes de `ac-lit`, no un paquete publicable.

## Estructura

```
__package_name__/
├── index.html              # Esqueleto HTML: header, navegación por hash y las páginas
├── src/
│   ├── app.js              # Shell: crea CCP + el router y decide qué página mostrar
│   ├── app.css             # Layout del shell (header, nav, [hidden])
│   ├── utils/
│   │   └── page-mixin.js   # PageMixin + pageBaseStyles: resuelve `ccp` y simplifica pub/sub
│   └── pages/              # Una página por custom element
│       ├── home-page.js                       # Portada
│       ├── users-table-page.js                # Publica el usuario seleccionado + enlaza al detalle
│       ├── user-detail-page.js                # Lee :id de la ruta y muestra ese usuario
│       └── selected-user-badge-page.js        # Muestra el último usuario seleccionado
├── vite.config.js
└── package.json
```

- `src/app.js` crea una única instancia de CCP con `createCCP()` y un router con `createRouter()` (4 rutas: `/`, `/usuarios`, `/usuarios/:id`, `/seleccionado`). Le asigna `ccp` a cada página, y a la página activa le asigna además `routeParams` (los parámetros de la ruta actual, ej. `{ id: '2' }`).
- `src/pages/*` son los componentes de cada página. Cada uno se registra con `customElements.define`.

## Comandos

```bash
pnpm run app:serve     # Servidor de desarrollo con Vite
pnpm run app:build     # Build de producción
pnpm run app:preview   # Sirve el build generado
pnpm run app:lint      # Lint del proyecto
```

## Navegación por rutas

Las páginas se navegan con [`@ac-base/ac-router`](https://github.com/RenzoCordovaDev/ac-lit/blob/main/packages/base/ac-router/README.md), un enrutador vanilla por hash con parámetros de ruta, sin ninguna librería externa. La ruta `/usuarios/:id` captura el id en la URL (`#/usuarios/2`) y **Detalle** lo recibe como `this.routeParams.id`. Puedes navegar con un enlace plano (`<a href="#/usuarios/2">`) o programáticamente con `router.navigate({ name: 'usuario-detalle', params: { id: 2 } })`.

## Comunicación entre páginas

Las páginas también se comunican con [`@ac-base/ac-ccp`](https://github.com/RenzoCordovaDev/ac-lit/blob/main/packages/base/ac-ccp/README.md) (Channel Communication Pattern) — un mecanismo **separado** del router, para pub/sub entre páginas sin pasar por la URL. La página **Usuarios** publica en el canal `'users.selected'` con retención, y la página **Seleccionado** se suscribe a ese mismo canal. Como el canal retiene el último mensaje, **Seleccionado** muestra el usuario aunque se haya elegido antes de entrar a esa página.

## Simplificar páginas con `PageMixin`

`src/utils/page-mixin.js` resuelve la parte repetitiva de conectar una página a CCP: declarar `ccp`, esperar a que esté disponible (`willUpdate`) y crear `ChannelController` a mano. Una página que necesita canales extiende `PageMixin(LitElement)` y sobreescribe `setupChannels()`:

```js
import { LitElement } from 'lit';
import { PageMixin, pageBaseStyles } from '../utils/page-mixin.js';

class MiPagina extends PageMixin(LitElement) {
  setupChannels() {
    this.publicarAlgo = this.connectionOut('mi.canal', { retain: true });
    this.connectionIn('otro.canal', payload => {
      this._valor = payload;
    });
  }
  // ...
}
```

- `connectionOut(nombre, { retain })` crea el canal de salida y devuelve una función `(payload) => void` lista para publicar.
- `connectionIn(nombre, onPayload, { replay })` se suscribe; `onPayload` recibe el `payload` ya desenvuelto (no el `message` completo).
- `pageBaseStyles` es el bloque `:host { display: block; line-height: 1.5; }` que comparten todas las páginas — se usa en `static get styles()` junto a los estilos propios: `return [pageBaseStyles, css\`...\`];`.

Una página que no necesita canales (como `home-page.js`) puede usar solo `pageBaseStyles`, sin extender `PageMixin`.

## Agregar una página nueva

1. Crea el archivo en `src/pages/`, por ejemplo `mi-pagina.js`, con un custom element (por ejemplo `app-mi-pagina`).
2. Importa el archivo en `src/app.js`.
3. Agrega la ruta al array de `createRouter([...])` en `src/app.js` (`{ path: '/mi-ruta', name: 'mi-pagina' }`, con `:param` si necesita uno) y la página al mapa `views`, con la misma clave (`name`).
4. Agrega un enlace en la navegación de `index.html` (`<a href="#/mi-ruta">...</a>`) y el elemento correspondiente dentro de `<main>`, con el atributo `hidden`.
