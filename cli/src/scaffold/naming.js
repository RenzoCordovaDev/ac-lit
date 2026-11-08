const TAG_PATTERN = /^ac-[a-z0-9]+(-[a-z0-9]+)*$/;

function toPascalCase(kebab) {
  return kebab
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
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
