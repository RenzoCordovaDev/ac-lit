import { expect } from '@open-wc/testing';
import { tokenizeHtml, splitTokensIntoLines } from '../src/highlight-html.js';

const typesOf = source => tokenizeHtml(source).map(token => token.type);
const textOf = tokens => tokens.map(token => token.text).join('');

suite('tokenizeHtml', () => {
  test('classifies an opening tag, its attribute and its value', () => {
    expect(typesOf('<a href="x">')).to.deep.equal([
      'punct',
      'tag',
      'plain',
      'attr',
      'punct',
      'string',
      'punct',
    ]);
  });

  test('classifies a closing tag', () => {
    expect(typesOf('</div>')).to.deep.equal(['punct', 'tag', 'punct']);
  });

  test('classifies the text between tags', () => {
    expect(typesOf('<b>hola</b>')[3]).to.equal('text');
  });

  test('classifies a comment as a single token', () => {
    expect(typesOf('<!-- nota -->')).to.deep.equal(['comment']);
  });

  test('keeps single-quoted values as strings', () => {
    expect(typesOf("<a href='x'>")).to.include('string');
  });

  test('classifies boolean attributes as attributes', () => {
    expect(tokenizeHtml('<button disabled>').find(token => token.type === 'attr').text).to.equal(
      'disabled',
    );
  });

  test('handles an unterminated comment without looping forever', () => {
    expect(typesOf('<!-- sin cierre')).to.deep.equal(['comment']);
  });

  test('never loses or alters characters', () => {
    const source = '<!-- c -->\n<ac-x a="1" b>\n  texto & más\n</ac-x>';
    expect(textOf(tokenizeHtml(source))).to.equal(source);
  });

  test('returns no tokens for an empty source', () => {
    expect(tokenizeHtml('')).to.deep.equal([]);
  });
});

suite('splitTokensIntoLines', () => {
  test('splits the tokens into one array per line', () => {
    expect(splitTokensIntoLines(tokenizeHtml('<a>\n<b>')).length).to.equal(2);
  });

  test('splits a multi-line comment across lines', () => {
    const lines = splitTokensIntoLines(tokenizeHtml('<!-- a\nb -->'));
    expect(lines.map(line => textOf(line))).to.deep.equal(['<!-- a', 'b -->']);
  });

  test('keeps blank lines as empty arrays', () => {
    expect(splitTokensIntoLines(tokenizeHtml('<a>\n\n<b>'))[1]).to.deep.equal([]);
  });

  test('keeps the leading indentation of each line', () => {
    const lines = splitTokensIntoLines(tokenizeHtml('<div>\n  <p>x</p>\n</div>'));
    expect(textOf(lines[1])).to.equal('  <p>x</p>');
  });
});
