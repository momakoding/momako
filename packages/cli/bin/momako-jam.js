#!/usr/bin/env node

import { runCreate } from '../src/create.js';

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === 'create') {
  const targetName = command === 'create' ? args[1] : command;
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--template' && args[i + 1]) {
      options.template = args[i + 1];
    }
  }
  runCreate(targetName, options).catch((err) => {
    console.error('\x1b[31mError:\x1b[0m', err.message);
    process.exit(1);
  });
} else if (command === '--help' || command === '-h' || command === 'help') {
  console.log(`
Momako Game Jam Matrix CLI

Usage:
  npx momako-jam create [project-name] [options]
  npm create momako-jam [project-name] [options]

Commands:
  create [name]    Create a new game jam project interactively

Options:
  --template <id>  Target engine (phaser | san | godot | unity | unreal)
  --help, -h       Show help information
  `);
} else {
  console.log(`Unknown command: "${command}". Try "momako-jam create [project-name]".`);
}
