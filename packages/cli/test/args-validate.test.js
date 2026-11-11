import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCliArgs } from '../src/args.js';
import { validateProjectName } from '../src/validate.js';

test('parses create with name and --template=er', () => {
  const args = parseCliArgs(['create', 'my-game', '--template=er']);
  assert.equal(args.command, 'create');
  assert.equal(args.name, 'my-game');
  assert.equal(args.template, 'er');
  assert.equal(args.git, true);
});

test('parses short flags -t -y -f', () => {
  const args = parseCliArgs(['create', 'x', '-t', 'san', '-y', '-f']);
  assert.equal(args.template, 'san');
  assert.equal(args.yes, true);
  assert.equal(args.force, true);
});

test('--no-git disables git', () => {
  assert.equal(parseCliArgs(['create', '--no-git']).git, false);
});

test('--help and --version flags are recognised', () => {
  assert.equal(parseCliArgs(['-h']).help, true);
  assert.equal(parseCliArgs(['-v']).version, true);
});

test('unknown template lists valid ids', () => {
  assert.throws(() => parseCliArgs(['create', '-t', 'phaser']), /Unknown template "phaser".*er, san, godot, unity, unreal/);
});

test('unknown option is rejected', () => {
  assert.throws(() => parseCliArgs(['create', '--nope']));
});

test('accepts valid project names', () => {
  ['my-game', 'game_1', 'a.b', 'x'.repeat(214), 'some/dir/my-game'].forEach((name) => {
    assert.equal(validateProjectName(name), null, name);
  });
});

test('rejects invalid project names', () => {
  ['', 'My-Game', '.hidden', '_private', 'has space', 'x'.repeat(215), 'a/.b', '..'].forEach((name) => {
    assert.notEqual(validateProjectName(name), null, name);
  });
});
