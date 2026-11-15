import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { isInsideAcLitWorkspace } from '../src/scaffold/workspace-context.js';

describe('isInsideAcLitWorkspace', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ac-cli-workspace-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('returns true from a subfolder of the ac-lit workspace root', () => {
    fs.writeFileSync(path.join(tmpDir, 'pnpm-workspace.yaml'), "packages:\n  - 'packages/*'\n");
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'ac-lit' }));
    const subDir = path.join(tmpDir, 'packages', 'components', 'ac-foo-basic');
    fs.mkdirSync(subDir, { recursive: true });

    assert.equal(isInsideAcLitWorkspace(subDir), true);
  });

  it('returns false for a pnpm workspace that is not ac-lit', () => {
    fs.writeFileSync(path.join(tmpDir, 'pnpm-workspace.yaml'), "packages:\n  - 'packages/*'\n");
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: 'otro-repo' }));

    assert.equal(isInsideAcLitWorkspace(tmpDir), false);
  });

  it('returns false when no pnpm-workspace.yaml is found up the tree', () => {
    assert.equal(isInsideAcLitWorkspace(tmpDir), false);
  });
});
