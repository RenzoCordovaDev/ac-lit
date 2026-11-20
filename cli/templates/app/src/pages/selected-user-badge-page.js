import { LitElement, css, html } from 'lit';
import '@ac-components/ac-badge-basic';
import { PageMixin, pageBaseStyles } from '../utils/page-mixin.js';

/**
 * Página "Seleccionado" de la app: se suscribe al canal `'users.selected'` y
 * muestra el último usuario seleccionado en la página "Usuarios". Si ya había un
 * mensaje retenido en el canal, lo muestra al montarse.
 *
 * @element app-selected-user-badge-page
 */
class AppSelectedUserBadgePage extends PageMixin(LitElement) {
  static get properties() {
    return {
      _lastMessage: { state: true },
    };
  }

  constructor() {
    super();
    this._lastMessage = null;
  }

  setupChannels() {
    this.connectionIn('users.selected', user => {
      this._lastMessage = user;
    });
  }

  static get styles() {
    return [
      pageBaseStyles,
      css`
        p {
          margin: 0 0 0.75rem;
        }
      `,
    ];
  }

  render() {
    return html`
      <h2>Seleccionado</h2>
      <p>
        Esta página muestra el último usuario seleccionado en <strong>Usuarios</strong>, incluso si
        ya se había seleccionado antes de entrar acá (mensaje retenido).
      </p>
      ${this._lastMessage
        ? html`<ac-badge-basic ambient="success">${this._lastMessage.name}</ac-badge-basic>`
        : html`<ac-badge-basic ambient="neutral">Nadie seleccionado aún</ac-badge-basic>`}
      <p><a href="#home">← Volver</a></p>
    `;
  }
}

customElements.define('app-selected-user-badge-page', AppSelectedUserBadgePage);
