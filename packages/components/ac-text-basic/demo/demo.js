import { addTextTranslations } from '../index.js';
import '@ac-base/ac-demo-content';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';

// Traducciones "de la aplicación" para el demo: claves libres (el literal que
// se escribe en `text`) con su equivalente por idioma.
addTextTranslations({
  'es-PE': {
    'demo-welcome': 'Bienvenido a ac-lit',
    'demo-greeting': 'Hola, {name}. Tienes {count} mensajes.',
  },
  'en-EN': {
    'demo-welcome': 'Welcome to ac-lit',
    'demo-greeting': 'Hello, {name}. You have {count} messages.',
  },
});
