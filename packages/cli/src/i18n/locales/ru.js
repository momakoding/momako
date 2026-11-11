/** Russian catalog. */
export default {
  'help.text': `
Momako - генератор заготовок для game jam

Использование:
  momako create [name] [options]
  npm create momako [name] [options]

Команды:
  create [name]          Создать новый проект для game jam (команда по умолчанию)

Параметры:
  -t, --template <id>    Используемый шаблон (см. ниже)
  -y, --yes              Принять значения по умолчанию: имя "my-jam-game", шаблон "er"
  -f, --force            Записывать в непустую папку
      --no-git           Не выполнять "git init"
      --lang <code>      Язык вывода: en, zh, ru, sh
  -h, --help             Показать эту справку
  -v, --version          Показать версию

Шаблоны:
{templates}
`,

  'engine.er': '2D для веба (Vue 3 + Phaser 4 / чистый Vue)',
  'engine.san': '3D для веба (Vue 3 + TresJS)',
  'engine.godot': 'Godot 4.x',
  'engine.unity': 'Unity 6 (WebGL / PC)',
  'engine.unreal': 'Unreal Engine 5',

  'validate.empty': 'Имя проекта не может быть пустым.',
  'validate.tooLong': 'Имя проекта не должно быть длиннее {max} символов.',
  'validate.badStart': 'Имя проекта не должно начинаться с "." или "_".',
  'validate.badChars': 'Имя проекта может содержать только строчные буквы, цифры, "-", "_" и ".".',

  'prompt.projectName': 'Имя проекта',
  'prompt.engine': 'Выберите игровой движок:',
  'prompt.enterNumber': 'Введите номер [1]: ',
  'prompt.nonEmptyConfirm': 'Целевая папка "{dir}" не пуста. Всё равно записать в неё?',
  'prompt.defaultYes': 'Д/н',
  'prompt.defaultNo': 'д/Н',
  'prompt.yesAnswers': 'y,yes,д,да',

  'hint.passName': 'Укажите имя проекта или используйте --yes.',
  'hint.passTemplate': 'Укажите --template <id> или используйте --yes.',
  'hint.useForce': 'Используйте --force.',

  'status.creating': 'Создаю {name} из шаблона "{template}" в {dir} ...',
  'status.wroteFiles': 'Записано файлов: {count}.',
  'status.gitInit': 'Git-репозиторий инициализирован.',
  'status.gitFailed': 'Примечание: не удалось выполнить "git init". Если репозиторий нужен, инициализируйте его вручную.',
  'status.cancelled': 'Отменено.',

  'next.title': 'Проект создан. Дальнейшие шаги:',
  'next.godot': 'Откройте project.godot в Godot 4.3 или новее.',
  'next.unity': 'Откройте папку в Unity Hub.',
  'next.unreal': 'Откройте файл .uproject в Unreal Engine 5.',
  'next.generic': 'Откройте проект в вашем движке.',

  'error.prefix': 'Ошибка',
  'error.unknownTemplate': 'Неизвестный шаблон "{template}". Доступные шаблоны: {valid}.',
  'error.unknownLang': 'Неизвестный язык "{lang}". Поддерживаемые языки: {supported}.',
  'error.unknownOption': 'Неизвестный параметр "{option}".',
  'error.parseFailed': 'Недопустимые аргументы: {detail}',
  'error.invalidName': 'Недопустимое имя проекта "{name}". {reason}',
  'error.nonTty': 'Невозможно задать вопрос: stdin не является TTY. {hint}',
  'error.notDirectory': '"{dir}" уже существует и не является папкой.',
  'error.notEmpty': 'Целевая папка "{dir}" не пуста. Чтобы всё равно записать в неё, используйте --force.',
  'error.templateNotFound': 'Шаблон "{template}" не найден.',
  'error.agentsNotFound': 'Не найден источник AGENTS.md (_AGENTS.md).',
  'error.baseTsconfigNotFound': 'Базовый tsconfig (tsconfig.base.json) не найден.',
  'error.versionsNotFound': 'Не удалось определить версии @momako/core и @momako/hud (отсутствует versions.json).',
  'error.workspaceVersionMissing': 'У зависимости рабочей области "{dep}" нет известной опубликованной версии.',
  'error.unknownCommand': 'Неизвестная команда "{command}".',
};
