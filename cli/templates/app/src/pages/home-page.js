import { html, LitElement } from 'lit';
import '@ac-components/ac-badge-basic';
import '@ac-components/ac-card-basic';
import { PageMixin, pageBaseStyles } from '../utils/page-mixin.js';

/**
 * Página de portada: publica un usuario de ejemplo en el canal global
 * `'global.user.data'` -- cualquier otra página puede suscribirse y recibirlo,
 * sin importar en qué orden la visiten.
 *
 * @element app-home-page
 */
class AppHomePage extends PageMixin(LitElement) {
  static get properties() {
    return {
      _userData: { state: true },
    };
  }

  constructor() {
    super();
    this._userData = null;
  }

  setupChannels() {
    const publishUserData = this.connectionOut('global.user.data', { retain: true });
    this._userData = {
      nombre: 'Ana Torres',
      email: 'ana.torres@ejemplo.com',
      telefono: '+51 999 888 777',
    };
    publishUserData(this._userData);
  }

  static get styles() {
    return [pageBaseStyles];
  }

  render() {
    return html`
      <div class="page">
        <h2>Bienvenido</h2>
        <ac-card-basic header-text="Canales de comunicación">
          <p>Esta app conecta sus páginas con <code>@ac-base/ac-ccp</code>, sin que se conozcan entre sí.</p>
          <p>
            Esta página publica un usuario de ejemplo en el canal global
            <code>'global.user.data'</code> — <strong>Usuarios</strong> y <strong>Seleccionado</strong>
            lo reciben, en cualquier orden.
          </p>
          ${this._userData
            ? html`<ac-badge-basic ambient="success">Transmitiendo: ${this._userData.nombre}</ac-badge-basic>`
            : html`<ac-badge-basic ambient="neutral">Preparando usuario…</ac-badge-basic>`}
        </ac-card-basic>
        <ac-card-basic header-text="Navegación por rutas">
          <p>
            <strong>Usuarios</strong> enlaza a <code>/usuarios/:id</code> con
            <code>@ac-base/ac-router</code> — un enrutador vanilla por hash, sin ninguna librería externa.
          </p>
        </ac-card-basic>
        <div class="page-actions">
          <a href="#/usuarios">Ir a Usuarios →</a>
          <a href="#/seleccionado">Ir a Seleccionado →</a>
        </div>
      </div>
    `;
  }
}

customElements.define('app-home-page', AppHomePage);
