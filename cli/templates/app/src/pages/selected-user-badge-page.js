import { LitElement, html, nothing } from 'lit';
import '@ac-components/ac-badge-basic';
import '@ac-components/ac-card-basic';
import { PageMixin, pageBaseStyles } from '../utils/page-mixin.js';

/**
 * Página "Seleccionado": se suscribe a `'users.selected'` y muestra el último
 * usuario seleccionado en "Usuarios" (mensaje retenido, llega aunque se haya
 * publicado antes de entrar a esta página). También muestra el usuario global
 * recibido por `'global.user.data'`.
 *
 * @element app-selected-user-badge-page
 */
class AppSelectedUserBadgePage extends PageMixin(LitElement) {
  static get properties() {
    return {
      _lastMessage: { state: true },
      _globalUser: { state: true },
    };
  }

  constructor() {
    super();
    this._lastMessage = null;
    this._globalUser = null;
  }

  setupChannels() {
    this.connectionIn('users.selected', user => {
      this._lastMessage = user;
    });
    this.connectionIn('global.user.data', user => {
      this._globalUser = user;
    });
  }

  static get styles() {
    return [pageBaseStyles];
  }

  render() {
    return html`
      <div class="page">
        <h2>Seleccionado</h2>
        ${this._globalUser
          ? html`<ac-badge-basic ambient="neutral">Usuario global: ${this._globalUser.nombre}</ac-badge-basic>`
          : nothing}
        <ac-card-basic header-text="Último seleccionado en Usuarios">
          ${this._lastMessage
            ? html`<ac-badge-basic ambient="success">${this._lastMessage.name}</ac-badge-basic>`
            : html`<ac-badge-basic ambient="neutral">Nadie seleccionado aún</ac-badge-basic>`}
        </ac-card-basic>
        <div class="page-actions">
          <a href="#/">← Volver</a>
        </div>
      </div>
    `;
  }
}

customElements.define('app-selected-user-badge-page', AppSelectedUserBadgePage);
