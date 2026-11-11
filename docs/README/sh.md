# Momako

<p align="center">
  <img src="../../assets/momako_full.jfif" alt="Momako" width="30%" />
</p>

<p align="center">
  <a href="../../README.md">English</a> · <a href="./zh.md">中文</a> · <a href="./ru.md">Русский</a> · <b>Srpskohrvatski</b>
</p>

> Početni komplet za game jamove i nezavisne igre.
>
> Sadrži glavni meni, zajedničko korisničko sučelje, dijalog za postavke, trajno sačuvane postavke zvuka i rezolucije, promjenu jezika, prilagodljiv canvas i pravila za rad s AI agentima.

---

## Podržani pogoni i njihovi tehnološki skupovi

Momako nudi više pogona i okvira koji dijele isto sučelje i istu komunikaciju zasnovanu na događajima:

| Pogon / režim | ID šablona | Naziv paketa | Karakteristike i primjena | Tehnološki skup |
| --- | --- | --- | --- | --- |
| 🎮 **2D Web** | `er` | `momako-er` | Phaser 4 arkadna fizika i generisanje nivoa. Podržava i čiste Vue igre (idle, kartaške, tekstualne misterije, inkrementalne) te mješavine oba pristupa. | Vue 3 + Phaser 4 / Pure Vue + HUD |
| 🌐 **3D Web** | `san` | `momako-san` | Deklarativne 3D scene, svjetla, mreže (mesh) i kamera koja prati igrača, napisani u TresJS-u. Pogodno za 3D prototipe. | Vue 3 + TresJS (Three.js) + HUD |
| 🤖 **Godot 4.x** | `godot` | `momako-godot` | Još nije implementirano | Godot 4, GDScript |
| ⚡ **Unity 6** | `unity` | `momako-unity` | Još nije implementirano | Unity 6, C# |
| 🔥 **Unreal 5** | `unreal` | `momako-unreal` | Još nije implementirano | UE5, Blueprints |

### Zajednički paketi

* **`@momako/hud`**: biblioteka korisničkog sučelja koju dijele svi web pogoni. Sadrži stranice glavnog menija (`home`), uputa za igru (`how-to-play`), dijaloga za postavke (`settings`) i zasluga (`about-us`), kontejner igre `<GameShellLayout>`, čuvanje postavki i spremljenih igara zasnovano na Pinia, te sistem stilova Tailwind CSS v4.
* **`@momako/core`**: sabirnica događaja bez zavisnosti i definicije događaja koje rade u svim pogonima. Prikaz igre i sloj sučelja zavise samo od protokola događaja, a ne jedno od drugog.

---

## Brzi početak: napravite svoj projekt igre

> 💡 **Napomena**: ovaj repozitorij je alat za generisanje projekata. Za izradu igre ne morate ga klonirati. Pokrenite naredbu u terminalu da biste napravili samostalan projekt:

```bash
npx momako create my-game
# or
npm create momako my-game
```

Interaktivni upit vodi vas kroz dva izbora:

1. **Naziv projekta** (zadano `my-jam-game`)
2. **Ciljni pogon**:
   * `1) 🎮 2D Web (Vue 3 + Phaser 4 / čisti Vue) - [momako-er]`
   * `2) 🌐 3D Web (TresJS / deklarativni 3D) - [momako-san]`
   * `3) 🤖 Godot 4.x Engine - [momako-godot]`
   * `4) ⚡ Unity 6 (WebGL/PC) - [momako-unity]`
   * `5) 🔥 Unreal Engine 5 - [momako-unreal]`

Upit možete preskočiti i pomoću argumenata:

```bash
npx momako create my-2d-game --template er
npx momako create my-3d-game --template san
```

### Razvoj u generisanom projektu

```bash
cd my-game
pnpm install
pnpm dev
```

Projekt dolazi s vlastitom Git konfiguracijom, dokumentom o dizajnu igranja `docs/spec/spec.md`, razvojnim vodičima u `docs/guide/` i datotekom `AGENTS.md` s pravilima AI suradnje prilagođenim razvijačima igara.

---

## Osnovni koncepti

1. **Prikaz igre je odvojen od sučelja**:
   * Canvas ili 3D prikaz samo pokreće igru, njenu fiziku i unos igrača.
   * Početni ekran, kontrole jačine i zvuka, postavke kvaliteta i rezolucije, meni pauze i spremanje igre nalaze se u `@momako/hud`. Dvije strane komuniciraju samo preko standardnih definicija događaja.

2. **Sadržaj igre može narasti u više stranica**:
   * Šabloni organizuju kod po domenama. Sadržaj igre je u `src/modules/game/`, a zajednički kod u `src/shared/`.
   * Možete dodavati podstranice igre, kao što su tekst priče, prodavnica, izbor nivoa ili inventar.

3. **Pravila za razvoj uz pomoć AI-ja**:
   * Konvencije Momakoding AI suradnje dolaze putem `AGENTS.md` i `docs/spec/`.
   * Njima su utvrđeni nazivi komponenti u kebab-case obliku, Tailwind v4 stil s `@apply`, format Keep a Changelog i korak potvrde prije commitova.

---

## Doprinos i održavanje okvira

Ako želite doprinijeti novim šablonom za pogon, proširiti HUD komponente ili održavati CLI, klonirajte ovaj monorepozitorij:

```bash
# 1. Install all workspace dependencies
pnpm install

# 2. Build and check everything in parallel
pnpm -r build

# 3. Check and sync maintainer and template docs
pnpm sync:docs

# 4. Start a dev server
pnpm dev:er      # 2D game development
pnpm dev:san     # 3D game development
pnpm dev:cli     # debug the scaffolding tool
```

---

## Zasluge i tim

* **Autor**: tim **Momakoding**
* **Zahvale otvorenom kodu**:
  * Hvala zajednicama [Phaser](https://phaser.io/), [TresJS](https://tresjs.org/), [Three.js](https://threejs.org/), [Vue 3](https://vuejs.org/) i [Tailwind CSS](https://tailwindcss.com/) na temeljima na kojima ovaj projekt počiva.
  * Hvala svim autorima game jamova i doprinositeljima otvorenom kodu.

---

## Licenca

Ovaj projekt objavljen je pod [MIT licencom](../../LICENSE).
