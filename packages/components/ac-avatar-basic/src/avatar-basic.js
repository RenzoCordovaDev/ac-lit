import { LitElement, html, nothing } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
// Authored in avatar-basic.styles.scss, compiled to avatar-basic.styles.js by
// `pnpm run component:build:styles` (@ac-base/cli/scripts/compile-scss-to-lit.cjs). The compiled file
// is gitignored — run `pnpm install` then `pnpm component:build` or `pnpm component:serve` to generate it.
import { AvatarBasicStyles } from './avatar-basic.styles.js';

const SIZES = new Set(['sm', 'md', 'lg']);
const DEFAULT_SIZE = 'md';

function initialsOf(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export class AvatarBasic extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-avatar-basic';
  }

  // componentBaseStyles primero: fija `font-family` y el skeleton de `loading`
  // (tokens "Emerald Pro", ver docs/CONVENTIONS.md) — no lo quites.
  static get styles() {
    return [componentBaseStyles, AvatarBasicStyles];
  }

  static get properties() {
    return {
      src: { type: String },
      name: { type: String },
      size: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.src = '';
    this.name = '';
    this.size = DEFAULT_SIZE;
    this.ambient = 'primary';
    this._imageFailed = false;
  }

  willUpdate(changed) {
    super.willUpdate?.(changed);
    // Antes del render (no en `updated()`, que llegaría tarde para este
    // mismo render): si cambia `src` después de un error previo, le damos a
    // la imagen nueva una chance real de cargar en vez de quedar pegada en
    // el fallback.
    if (changed.has('src')) this._imageFailed = false;
  }

  get _size() {
    return SIZES.has(this.size) ? this.size : DEFAULT_SIZE;
  }

  get _initials() {
    return initialsOf(this.name);
  }

  get _fallbackLabel() {
    return this.name || this.t('avatar-basic-unknown');
  }

  render() {
    const classes = `ac-avatar-basic ac-avatar--${this.ambient} ac-avatar--${this._size}`;
    const showImage = Boolean(this.src) && !this._imageFailed;

    return html`
      <span part="root" class=${classes}>
        ${
          showImage
            ? html`<img
                part="image"
                class="ac-avatar-basic__image"
                src=${this.src}
                alt=${this.name}
                @error=${this._onImageError}
              />`
            : html`<span
                part="fallback"
                class="ac-avatar-basic__fallback"
                role="img"
                aria-label=${this._fallbackLabel}
              >
                ${this._initials ? html`<span aria-hidden="true">${this._initials}</span>` : nothing}
              </span>`
        }
      </span>
    `;
  }

  _onImageError() {
    this._imageFailed = true;
    this.requestUpdate();
  }
}
