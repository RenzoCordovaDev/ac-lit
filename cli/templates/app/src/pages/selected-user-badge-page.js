import { LitElement, html, nothing } from 'lit';
import '@ac-components/ac-badge-basic';
import '@ac-components/ac-card-basic';
import '@ac-components/ac-icon-basic';
import '@ac-components/ac-link-basic';
import '@ac-components/ac-text-basic';
import { PageMixin, pageBaseStyles } from '../utils/page-mixin.js';

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
        <ac-text-basic tag="h2">Seleccionado</ac-text-basic>
        ${this._globalUser
          ? html`<ac-badge-basic ambient="neutral">
              <ac-icon-basic name="check" size="sm"></ac-icon-basic> Usuario global:
              ${this._globalUser.nombre}
            </ac-badge-basic>`
          : nothing}
        <ac-card-basic header-text="Último seleccionado en Usuarios">
          ${this._lastMessage
            ? html`<ac-badge-basic ambient="success">
                <ac-icon-basic name="success" size="sm"></ac-icon-basic> ${this._lastMessage.name}
              </ac-badge-basic>`
            : html`<ac-badge-basic ambient="neutral">Nadie seleccionado aún</ac-badge-basic>`}
        </ac-card-basic>
        <div class="page-actions">
          <ac-link-basic href="#/"
            ><ac-icon-basic name="arrow-left" size="sm"></ac-icon-basic> Volver</ac-link-basic
          >
        </div>
      </div>
    `;
  }
}

customElements.define('app-selected-user-badge-page', AppSelectedUserBadgePage);
