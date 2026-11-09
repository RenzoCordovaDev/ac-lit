const COMMENT = /<!--[\s\S]*?(?:-->|$)/y;
const TAG_OPEN = /<(\/?)([A-Za-z][\w:-]*)/y;
const TAG_CLOSE = /\/?>/y;
const ATTR_NAME = /[^\s"'<>/=]+/y;
const ATTR_VALUE = /"[^"]*"?|'[^']*'?/y;
const WHITESPACE = /\s+/y;
const TEXT = /[^<]+/y;

function match(pattern, source, index) {
  pattern.lastIndex = index;
  return pattern.exec(source);
}

/**
 * Tokeniza HTML para resaltarlo en la vista de código. No es un parser: solo
 * distingue comentarios, etiquetas, atributos, valores y texto — lo justo para
 * colorear el HTML de un caso de demo. Tipos: comment, punct, tag, attr,
 * string, text, plain.
 */
export function tokenizeHtml(source) {
  const tokens = [];
  const push = (type, text) => {
    if (text) tokens.push({ type, text });
  };
  let index = 0;
  let inTag = false;

  while (index < source.length) {
    let found;

    if (inTag) {
      if ((found = match(WHITESPACE, source, index))) {
        push('plain', found[0]);
      } else if ((found = match(TAG_CLOSE, source, index))) {
        push('punct', found[0]);
        inTag = false;
      } else if (source[index] === '=') {
        found = ['='];
        push('punct', '=');
      } else if ((found = match(ATTR_VALUE, source, index))) {
        push('string', found[0]);
      } else if ((found = match(ATTR_NAME, source, index))) {
        push('attr', found[0]);
      } else {
        found = [source[index]];
        push('plain', found[0]);
      }
    } else if ((found = match(COMMENT, source, index))) {
      push('comment', found[0]);
    } else if ((found = match(TAG_OPEN, source, index))) {
      push('punct', `<${found[1]}`);
      push('tag', found[2]);
      inTag = true;
    } else if ((found = match(TEXT, source, index))) {
      push('text', found[0]);
    } else {
      found = [source[index]];
      push('text', found[0]);
    }

    index += found[0].length;
  }

  return tokens;
}

/** Reparte los tokens en líneas (un token multilínea, como un comentario, se parte en varios). */
export function splitTokensIntoLines(tokens) {
  const lines = [[]];

  for (const token of tokens) {
    const parts = token.text.split('\n');
    parts.forEach((part, partIndex) => {
      if (partIndex > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ type: token.type, text: part });
    });
  }

  return lines;
}
