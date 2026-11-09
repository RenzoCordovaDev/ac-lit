/**
 * Copia `text` al portapapeles. Usa la Clipboard API y, si no está disponible
 * (contexto no seguro, ej. http://<ip-de-la-red>) o rechaza el permiso, cae a
 * un `<textarea>` temporal con `execCommand('copy')`. Devuelve si se pudo copiar.
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return copyWithTextarea(text);
  }
}

function copyWithTextarea(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}
