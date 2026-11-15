/**
 * Dispatch a custom event from an element, bubbling and composed by default
 * so it crosses shadow DOM boundaries — required by the `ac-*` event convention.
 */
export function dispatchCustomEvent(element, eventName, detail = {}, options = {}) {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    composed: true,
    ...options,
  });
  element.dispatchEvent(event);
  return event;
}

export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Atrapa el foco (Tab/Shift+Tab) dentro de `container` y devuelve el foco a
 * quien lo tenía antes al desactivarse — para overlays que no pueden usar el
 * atrapado nativo de `<dialog>.showModal()`/`popover` (ej. un modal "contenido"
 * dentro de un simulador de dispositivo, que no debe bloquear el resto de la
 * página real). `container` puede ser un elemento de un shadow root: el foco
 * previo se restaura vía `document.activeElement`, que ya apunta al host
 * correcto cuando el foco vive fuera de ese shadow root.
 */
export function createFocusTrap(container) {
  let previousActiveElement = null;
  let onKeydown = null;

  function focusableElements() {
    return [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
      el => el.offsetParent !== null,
    );
  }

  function activate() {
    previousActiveElement = document.activeElement;
    const [first] = focusableElements();
    (first ?? container).focus();

    onKeydown = event => {
      if (event.key !== 'Tab') return;
      const elements = focusableElements();
      if (elements.length === 0) {
        event.preventDefault();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    container.addEventListener('keydown', onKeydown);
  }

  function deactivate() {
    if (onKeydown) container.removeEventListener('keydown', onKeydown);
    onKeydown = null;
    previousActiveElement?.focus?.();
    previousActiveElement = null;
  }

  return { activate, deactivate };
}
