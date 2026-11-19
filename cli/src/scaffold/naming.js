const TAG_PATTERN = /^ac-[a-z0-9]+(-[a-z0-9]+)*$/;
const APP_NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function toPascalCase(kebab) {
  return kebab
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function toTitleCase(kebab) {
  return kebab
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Deriva todo el naming de un componente (clase, archivo, paquete, etc.) a
 * partir del nombre completo con prefijo `ac-` (ej. "ac-foo-basic"), según
 * la tabla de convenciones de docs/CONVENTIONS.md.
 */
export function deriveComponentNames(rawName) {
  if (!TAG_PATTERN.test(rawName)) {
    throw new Error(
      `Nombre inválido: "${rawName}". Debe ser kebab-case y empezar con "ac-" (ej. "ac-mi-componente").`,
    );
  }

  const fileBase = rawName.slice('ac-'.length);
  const className = toPascalCase(fileBase);

  return {
    tag: rawName,
    folder: rawName,
    fileBase,
    className,
    stylesExportName: `${className}Styles`,
    packageName: `@ac-components/${rawName}`,
  };
}

/**
 * Deriva el naming de un proyecto de app nueva a partir de su nombre
 * (ej. "mi-app") — a diferencia de un componente, no exige prefijo `ac-` ni
 * scope de npm: es el proyecto propio de quien lo genera, nunca un paquete
 * publicable al catálogo de `ac-lit`.
 */
export function deriveAppNames(rawName) {
  if (!APP_NAME_PATTERN.test(rawName)) {
    throw new Error(`Nombre inválido: "${rawName}". Debe ser kebab-case (ej. "mi-app").`);
  }

  return {
    folder: rawName,
    packageName: rawName,
    title: toTitleCase(rawName),
  };
}
