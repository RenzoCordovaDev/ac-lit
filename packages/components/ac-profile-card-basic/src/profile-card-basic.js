import { LitElement, html, nothing } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
// Dependencias del catálogo: se registran como efecto de importar su `index.js`.
import '@ac-components/ac-avatar-basic';
import '@ac-components/ac-badge-basic';
import '@ac-components/ac-button-basic';
import '@ac-components/ac-text-basic';

import { ProfileCardBasicStyles } from './profile-card-basic.styles.js';

/**
 * ac-profile-card-basic: tarjeta de perfil de usuario — componente de
 * ejemplo que demuestra el patrón de composición del catálogo (ver
 * "Dependencias entre componentes del catálogo" en docs/CONVENTIONS.md),
 * reutilizando 4 piezas ya existentes: `ac-avatar-basic`, `ac-text-basic`,
 * `ac-badge-basic` y `ac-button-basic`. Ninguna pieza expone su API interna:
 * los eventos (`ac-button-basic-click`) se detienen con `stopPropagation()`
 * y el componente emite los suyos propios.
 */
export class ProfileCardBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-profile-card-basic';
  }

  // componentBaseStyles primero: fija `font-family` y el skeleton de `loading`
  // (tokens "Emerald Pro", ver docs/CONVENTIONS.md) — no lo quites.
  static get styles() {
    return [componentBaseStyles, ProfileCardBasicStyles];
  }

  static get properties() {
    return {
      name: { type: String },
      avatarSrc: { type: String, attribute: 'avatar-src' },
      statusText: { type: String, attribute: 'status-text' },
      statusAmbient: { type: String, attribute: 'status-ambient' },
      actionText: { type: String, attribute: 'action-text' },
    };
  }

  constructor() {
    super();
    this.name = '';
    this.avatarSrc = '';
    this.statusText = '';
    this.statusAmbient = 'neutral';
    this.actionText = '';
  }

  render() {
    return html`
      <div part="root" class="ac-profile-card-basic">
        <ac-avatar-basic part="avatar" src=${this.avatarSrc} name=${this.name}></ac-avatar-basic>
        <div class="ac-profile-card-basic__body">
          <ac-text-basic part="name" text=${this.name} tag="strong"></ac-text-basic>
          ${
            this.statusText
              ? html`<ac-badge-basic
                  part="status"
                  text=${this.statusText}
                  ambient=${this.statusAmbient}
                ></ac-badge-basic>`
              : nothing
          }
        </div>
        ${
          this.actionText
            ? html`<ac-button-basic part="action" @ac-button-basic-click=${this._onActionClick}>
                ${this.t(this.actionText)}
              </ac-button-basic>`
            : nothing
        }
      </div>
    `;
  }

  _onActionClick(event) {
    event.stopPropagation();
    this._emit('ac-profile-card-basic-action-click');
  }

  _emit(name, detail = true) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}
