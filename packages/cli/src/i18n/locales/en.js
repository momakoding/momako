/** English catalog. Source of truth: every other locale must have exactly these keys and placeholders. */
export default {
  'help.text': `
Momako - game jam starter scaffolder

Usage:
  momako create [name] [options]
  npm create momako [name] [options]

Commands:
  create [name]          Create a new game jam project (default command)

Options:
  -t, --template <id>    Template to use (see below)
  -y, --yes              Accept defaults: name "my-jam-game", template "er"
  -f, --force            Write into a non-empty directory
      --no-git           Do not run "git init"
      --lang <code>      Output language: en, zh, ru, sh
  -h, --help             Show this help
  -v, --version          Show the version

Templates:
{templates}
`,

  'engine.er': '2D Web (Vue 3 + Phaser 4 / plain Vue)',
  'engine.san': '3D Web (Vue 3 + TresJS)',
  'engine.godot': 'Godot 4.x',
  'engine.unity': 'Unity 6 (WebGL / PC)',
  'engine.unreal': 'Unreal Engine 5',

  'validate.empty': 'Project name must not be empty.',
  'validate.tooLong': 'Project name must be at most {max} characters.',
  'validate.badStart': 'Project name must not start with "." or "_".',
  'validate.badChars': 'Project name may only contain lowercase letters, digits, "-", "_" and ".".',

  'prompt.projectName': 'Project name',
  'prompt.engine': 'Select a game engine:',
  'prompt.enterNumber': 'Enter a number [1]: ',
  'prompt.nonEmptyConfirm': 'Target directory "{dir}" is not empty. Write into it anyway?',
  'prompt.defaultYes': 'Y/n',
  'prompt.defaultNo': 'y/N',
  'prompt.yesAnswers': 'y,yes',

  'hint.passName': 'Pass a project name or use --yes.',
  'hint.passTemplate': 'Pass --template <id> or use --yes.',
  'hint.useForce': 'Use --force.',

  'status.creating': 'Creating {name} from template "{template}" in {dir} ...',
  'status.wroteFiles': 'Wrote {count} files.',
  'status.gitInit': 'Initialized a git repository.',
  'status.gitFailed': 'Note: could not run "git init". Initialize the repository manually if you need one.',
  'status.cancelled': 'Cancelled.',

  'next.title': 'Project created. Next steps:',
  'next.godot': 'Open project.godot with Godot 4.3 or newer.',
  'next.unity': 'Open the folder with Unity Hub.',
  'next.unreal': 'Open the .uproject file with Unreal Engine 5.',
  'next.generic': 'Open the project with your engine.',

  'error.prefix': 'Error',
  'error.unknownTemplate': 'Unknown template "{template}". Valid templates: {valid}.',
  'error.unknownLang': 'Unknown language "{lang}". Supported languages: {supported}.',
  'error.unknownOption': 'Unknown option "{option}".',
  'error.parseFailed': 'Invalid arguments: {detail}',
  'error.invalidName': 'Invalid project name "{name}". {reason}',
  'error.nonTty': 'Cannot prompt because stdin is not a TTY. {hint}',
  'error.notDirectory': '"{dir}" exists and is not a directory.',
  'error.notEmpty': 'Target directory "{dir}" is not empty. Use --force to write into it anyway.',
  'error.templateNotFound': 'Template "{template}" was not found.',
  'error.agentsNotFound': 'AGENTS.md source (_AGENTS.md) was not found.',
  'error.baseTsconfigNotFound': 'Base tsconfig (tsconfig.base.json) was not found.',
  'error.hudNotFound': 'HUD sources (packages/hud or the packaged hud folder) were not found.',
  'error.coreNotFound': 'Core sources (packages/core or the packaged core folder) were not found.',
  'error.mergeConflict': 'Cannot merge into the project: "{file}" already exists.',
  'error.workspaceVersionMissing': 'Workspace dependency "{dep}" has no known published version.',
  'error.unknownCommand': 'Unknown command "{command}".',
};
