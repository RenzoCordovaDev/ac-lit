import { html, LitElement } from 'lit';
import '@ac-components/ac-badge-basic';
import '@ac-components/ac-card-basic';
import '@ac-components/ac-icon-basic';
import '@ac-components/ac-link-basic';
import '@ac-components/ac-text-basic';
import { PageMixin, pageBaseStyles } from '../utils/page-mixin.js';

class AppHomePage extends PageMixin(LitElement) {
  static get properties() {
    return { _userData: { state: true } };
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
        <ac-text-basic tag="h2">Bienvenido</ac-text-basic>
        <ac-card-basic header-text="Canales de comunicación">
          <div class="icon-row">
            <ac-icon-basic name="info" size="sm"></ac-icon-basic>
            <ac-text-basic tag="p"
              >Esta app conecta sus páginas con @ac-base/ac-ccp, sin que se conozcan entre sí.</ac-text-basic
            >
          </div>
          <ac-text-basic tag="p"
            >Esta página publica un usuario de ejemplo en el canal global 'global.user.data'. Usuarios y
            Seleccionado lo reciben, en cualquier orden.</ac-text-basic
          >
          ${this._userData
            ? html`<ac-badge-basic ambient="success">
                <ac-icon-basic name="success" size="sm"></ac-icon-basic> Transmitiendo:
                ${this._userData.nombre}
              </ac-badge-basic>`
            : html`<ac-badge-basic ambient="neutral">
                <ac-icon-basic name="info" size="sm"></ac-icon-basic> Preparando usuario…
              </ac-badge-basic>`}
        </ac-card-basic>
        <ac-card-basic header-text="Navegación por rutas">
          <div class="icon-row">
            <ac-icon-basic name="chevron-right" size="sm"></ac-icon-basic>
            <ac-text-basic tag="p"
              >Usuarios enlaza a /usuarios/:id con @ac-base/ac-router, un enrutador vanilla por hash, sin
              ninguna librería externa.</ac-text-basic
            >
          </div>
        </ac-card-basic>
        <div class="page-actions">
          <ac-link-basic href="#/usuarios"
            >Ir a Usuarios <ac-icon-basic name="arrow-right" size="sm"></ac-icon-basic
          ></ac-link-basic>
          <ac-link-basic href="#/seleccionado"
            >Ir a Seleccionado <ac-icon-basic name="arrow-right" size="sm"></ac-icon-basic
          ></ac-link-basic>
        </div>
      </div>
    `;
  }
}

customElements.define('app-home-page', AppHomePage);
