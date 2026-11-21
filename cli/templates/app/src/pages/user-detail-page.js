import { html, LitElement } from 'lit';
import '@ac-components/ac-badge-basic';
import '@ac-components/ac-card-basic';
import '@ac-components/ac-icon-basic';
import '@ac-components/ac-link-basic';
import '@ac-components/ac-text-basic';
import { pageBaseStyles } from '../utils/page-mixin.js';

const USERS = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Luis' },
  { id: 3, name: 'Carla' },
];

class AppUserDetailPage extends LitElement {
  static properties = {
    routeParams: { attribute: false },
  };

  constructor() {
    super();
    this.routeParams = {};
  }

  static get styles() {
    return [pageBaseStyles];
  }

  render() {
    const user = USERS.find(candidate => String(candidate.id) === this.routeParams.id);
    return html`
      <div class="page">
        <ac-text-basic tag="h2">Detalle</ac-text-basic>
        <ac-card-basic header-text="Usuario de la ruta">
          ${user
            ? html`
                <ac-text-basic tag="p">Usuario: ${user.name}</ac-text-basic>
                <ac-badge-basic ambient="neutral">ID ${user.id}</ac-badge-basic>
              `
            : html`<ac-badge-basic ambient="danger">
                <ac-icon-basic name="danger" size="sm"></ac-icon-basic> Usuario no encontrado
              </ac-badge-basic>`}
        </ac-card-basic>
        <div class="page-actions">
          <ac-link-basic href="#/usuarios"
            ><ac-icon-basic name="arrow-left" size="sm"></ac-icon-basic> Volver a Usuarios</ac-link-basic
          >
        </div>
      </div>
    `;
  }
}

customElements.define('app-user-detail-page', AppUserDetailPage);
