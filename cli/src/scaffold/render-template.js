/** Reemplaza placeholders `__token__` por su valor en `tokens`. */
export function renderTemplateString(content, tokens) {
  return Object.entries(tokens).reduce(
    (acc, [key, value]) => acc.replaceAll(`__${key}__`, value),
    content,
  );
}
