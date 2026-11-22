---
'@ac-base/cli': minor
---

`cli/scripts/compile-scss-to-lit.cjs` suma un modo "carpeta": si el primer argumento es un directorio en vez de un archivo `.scss`, escanea recursivamente todos los `*.styles.scss` que encuentre y compila (o crea) el `.styles.js` hermano de cada uno — con `--watch` vigila la carpeta completa en vez de un solo archivo. Resuelve el caso real de un componente con sub-componentes propios (cada uno con su propio `.scss`), que antes solo se podía resolver encadenando una invocación manual del script por cada archivo. El modo archivo explícito de siempre sigue funcionando igual, sin ningún cambio — el template de `component:create` (`cli/templates/component/package.json`) ya pasa a usar el modo carpeta por defecto para los componentes nuevos.
