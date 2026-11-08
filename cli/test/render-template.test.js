import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderTemplateString } from '../src/scaffold/render-template.js';

describe('renderTemplateString', () => {
  it('replaces every occurrence of a token', () => {
    const result = renderTemplateString('class __class_name__ { static is = "__tag__"; }', {
      class_name: 'FooBasic',
      tag: 'ac-foo-basic',
    });
    assert.equal(result, 'class FooBasic { static is = "ac-foo-basic"; }');
  });

  it('leaves text without matching tokens untouched', () => {
    const result = renderTemplateString('plain text', { foo: 'bar' });
    assert.equal(result, 'plain text');
  });
});
