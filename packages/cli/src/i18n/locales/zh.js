/** Simplified Chinese catalog. */
export default {
  'help.text': `
Momako - Game Jam 项目脚手架

用法:
  momako create [name] [options]
  npm create momako [name] [options]

命令:
  create [name]          创建新的 Game Jam 项目（默认命令）

选项:
  -t, --template <id>    使用的模板（见下文）
  -y, --yes              使用默认值：名称 "my-jam-game"，模板 "er"
  -f, --force            允许写入非空目录
      --no-git           不执行 "git init"
      --lang <code>      输出语言：en, zh, ru, sh
  -h, --help             显示此帮助
  -v, --version          显示版本号

模板:
{templates}
`,

  'engine.er': '2D 网页（Vue 3 + Phaser 4 / 纯 Vue）',
  'engine.san': '3D 网页（Vue 3 + TresJS）',
  'engine.godot': 'Godot 4.x',
  'engine.unity': 'Unity 6（WebGL / PC）',
  'engine.unreal': 'Unreal Engine 5',

  'validate.empty': '项目名称不能为空。',
  'validate.tooLong': '项目名称最多 {max} 个字符。',
  'validate.badStart': '项目名称不能以 "." 或 "_" 开头。',
  'validate.badChars': '项目名称只能包含小写字母、数字、"-"、"_" 和 "."。',

  'prompt.projectName': '项目名称',
  'prompt.engine': '选择游戏引擎：',
  'prompt.enterNumber': '输入编号 [1]：',
  'prompt.nonEmptyConfirm': '目标目录 "{dir}" 非空。仍要写入吗？',
  'prompt.defaultYes': 'Y/n',
  'prompt.defaultNo': 'y/N',
  'prompt.yesAnswers': 'y,yes,是',

  'hint.passName': '请传入项目名称或使用 --yes。',
  'hint.passTemplate': '请传入 --template <id> 或使用 --yes。',
  'hint.useForce': '请使用 --force。',

  'status.creating': '正在使用模板 "{template}" 在 {dir} 中创建 {name} ...',
  'status.wroteFiles': '已写入 {count} 个文件。',
  'status.gitInit': '已初始化 git 仓库。',
  'status.gitFailed': '注意：无法执行 "git init"。如需仓库，请手动初始化。',
  'status.cancelled': '已取消。',

  'next.title': '项目已创建。后续步骤：',
  'next.godot': '用 Godot 4.3 或更高版本打开 project.godot。',
  'next.unity': '用 Unity Hub 打开该文件夹。',
  'next.unreal': '用 Unreal Engine 5 打开 .uproject 文件。',
  'next.generic': '用你的引擎打开项目。',

  'error.prefix': '错误',
  'error.unknownTemplate': '未知模板 "{template}"。可用模板：{valid}。',
  'error.unknownLang': '未知语言 "{lang}"。支持的语言：{supported}。',
  'error.unknownOption': '未知选项 "{option}"。',
  'error.parseFailed': '参数无效：{detail}',
  'error.invalidName': '项目名称 "{name}" 无效。{reason}',
  'error.nonTty': '无法提示输入，因为 stdin 不是 TTY。{hint}',
  'error.notDirectory': '"{dir}" 已存在且不是目录。',
  'error.notEmpty': '目标目录 "{dir}" 非空。如需仍然写入，请使用 --force。',
  'error.templateNotFound': '找不到模板 "{template}"。',
  'error.agentsNotFound': '找不到 AGENTS.md 的源文件 (_AGENTS.md)。',
  'error.baseTsconfigNotFound': '找不到基础 tsconfig (tsconfig.base.json)。',
  'error.hudNotFound': '找不到 HUD 源码（packages/hud 或随包携带的 hud 目录）。',
  'error.coreNotFound': '找不到 core 源码（packages/core 或随包携带的 core 目录）。',
  'error.mergeConflict': '无法合并进工程："{file}" 已存在。',
  'error.workspaceVersionMissing': '工作区依赖 "{dep}" 没有已知的发布版本。',
  'error.unknownCommand': '未知命令 "{command}"。',
};
