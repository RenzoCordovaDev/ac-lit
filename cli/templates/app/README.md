# __title__

Proyecto generado con `aclit app:create __package_name__`. Es una app propia construida con los componentes de `ac-lit`, no un paquete publicable.

## Estructura

```
__package_name__/
├── index.html              # Esqueleto HTML: header, navegación por hash y las páginas
├── src/
│   ├── app.js              # Shell: crea la instancia de CCP y maneja la navegación por hash
│   ├── app.css             # Layout del shell (header, nav, [hidden])
│   └── pages/              # Una página por custom element
│       ├── home-page.js                       # Portada
│       ├── users-table-page.js                # Publica el usuario seleccionado
│       └── selected-user-badge-page.js        # Muestra el último usuario seleccionado
├── vite.config.js
└── package.json
```

- `src/app.js` crea una única instancia de CCP con `createCCP()`, se la asigna a cada página y muestra solo la página cuyo id coincide con el hash de la URL (`#home`, `#tabla`, `#seleccion`).
- `src/pages/*` son los componentes de cada página. Cada uno se registra con `customElements.define`.

## Comandos

```bash
pnpm run app:serve     # Servidor de desarrollo con Vite
pnpm run app:build     # Build de producción
pnpm run app:preview   # Sirve el build generado
pnpm run app:lint      # Lint del proyecto
```

## Comunicación entre páginas

Las páginas se comunican con [`@ac-base/ac-ccp`](https://github.com/RenzoCordovaDev/ac-lit/blob/main/packages/base/ac-ccp/README.md) (Channel Communication Pattern). La página **Usuarios** publica en el canal `'users.selected'` con retención, y la página **Seleccionado** se suscribe a ese mismo canal. Como el canal retiene el último mensaje, **Seleccionado** muestra el usuario aunque se haya elegido antes de entrar a esa página.

## Agregar una página nueva

1. Crea el archivo en `src/pages/`, por ejemplo `mi-pagina.js`, con un custom element (por ejemplo `app-mi-pagina`).
2. Importa el archivo en `src/app.js`.
3. Agrega la página al mapa `views` en `src/app.js`, con la misma clave que usarás en el hash.
4. Agrega un enlace en la navegación de `index.html` (`<a href="#mi-clave">...</a>`) y el elemento correspondiente dentro de `<main>`, con el atributo `hidden`.
