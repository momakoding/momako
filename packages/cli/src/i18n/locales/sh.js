/** Serbo-Croatian catalog (Latin script, Ijekavian). */
export default {
  'help.text': `
Momako - generator početnih projekata za game jam

Upotreba:
  momako create [name] [options]
  npm create momako [name] [options]

Naredbe:
  create [name]          Izradi novi game jam projekt (zadana naredba)

Opcije:
  -t, --template <id>    Predložak koji se koristi (vidi dolje)
  -y, --yes              Prihvati zadane vrijednosti: naziv "my-jam-game", predložak "er"
  -f, --force            Dopusti upis u neprazan direktorij
      --no-git           Ne pokreći "git init"
      --lang <code>      Jezik ispisa: en, zh, ru, sh
  -h, --help             Prikaži ovu pomoć
  -v, --version          Prikaži verziju

Predlošci:
{templates}
`,

  'engine.er': '2D web (Vue 3 + Phaser 4 / čisti Vue)',
  'engine.san': '3D web (Vue 3 + TresJS)',
  'engine.godot': 'Godot 4.x',
  'engine.unity': 'Unity 6 (WebGL / PC)',
  'engine.unreal': 'Unreal Engine 5',

  'validate.empty': 'Naziv projekta ne smije biti prazan.',
  'validate.tooLong': 'Naziv projekta smije imati najviše {max} znakova.',
  'validate.badStart': 'Naziv projekta ne smije počinjati znakom "." ili "_".',
  'validate.badChars': 'Naziv projekta smije sadržavati samo mala slova, brojke, "-", "_" i ".".',

  'prompt.projectName': 'Naziv projekta',
  'prompt.engine': 'Odaberi pokretač igre:',
  'prompt.enterNumber': 'Upiši broj [1]: ',
  'prompt.nonEmptyConfirm': 'Odredišni direktorij "{dir}" nije prazan. Želiš li svejedno upisati u njega?',
  'prompt.defaultYes': 'D/n',
  'prompt.defaultNo': 'd/N',
  'prompt.yesAnswers': 'y,yes,d,da',

  'hint.passName': 'Navedi naziv projekta ili koristi --yes.',
  'hint.passTemplate': 'Navedi --template <id> ili koristi --yes.',
  'hint.useForce': 'Koristi --force.',

  'status.creating': 'Izrađujem {name} iz predloška "{template}" u {dir} ...',
  'status.wroteFiles': 'Zapisano datoteka: {count}.',
  'status.gitInit': 'Git repozitorij je inicijaliziran.',
  'status.gitFailed': 'Napomena: nije moguće pokrenuti "git init". Ako ti treba repozitorij, inicijaliziraj ga ručno.',
  'status.cancelled': 'Otkazano.',

  'next.title': 'Projekt je izrađen. Sljedeći koraci:',
  'next.godot': 'Otvori project.godot u Godotu 4.3 ili novijem.',
  'next.unity': 'Otvori direktorij u Unity Hubu.',
  'next.unreal': 'Otvori datoteku .uproject u Unreal Engineu 5.',
  'next.generic': 'Otvori projekt u svom pokretaču.',

  'error.prefix': 'Greška',
  'error.unknownTemplate': 'Nepoznat predložak "{template}". Valjani predlošci: {valid}.',
  'error.unknownLang': 'Nepoznat jezik "{lang}". Podržani jezici: {supported}.',
  'error.unknownOption': 'Nepoznata opcija "{option}".',
  'error.parseFailed': 'Neispravni argumenti: {detail}',
  'error.invalidName': 'Neispravan naziv projekta "{name}". {reason}',
  'error.nonTty': 'Upit nije moguć jer stdin nije TTY. {hint}',
  'error.notDirectory': '"{dir}" već postoji i nije direktorij.',
  'error.notEmpty': 'Odredišni direktorij "{dir}" nije prazan. Koristi --force da svejedno upišeš u njega.',
  'error.templateNotFound': 'Predložak "{template}" nije pronađen.',
  'error.agentsNotFound': 'Izvor za AGENTS.md (_AGENTS.md) nije pronađen.',
  'error.baseTsconfigNotFound': 'Osnovni tsconfig (tsconfig.base.json) nije pronađen.',
  'error.versionsNotFound': 'Nije moguće odrediti verzije @momako/core i @momako/hud (nedostaje versions.json).',
  'error.workspaceVersionMissing': 'Ovisnost radnog prostora "{dep}" nema poznatu objavljenu verziju.',
  'error.unknownCommand': 'Nepoznata naredba "{command}".',
};
