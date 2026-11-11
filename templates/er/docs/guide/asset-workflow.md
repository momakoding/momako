# 美术与音频素材工作流 (Asset Workflow)

## 1. 静态资源存放路径

- 图片、精灵图、音效放入 `public/assets/` 目录。
- 构建时 Vite 会原样打包，在代码中直接以 `/assets/xxx.png` 绝对路径引用。

## 2. 在 Phaser 中加载与使用

在 `src/scenes/boot-scene.ts` 的 `preload()` 方法中载入素材：

```typescript
preload() {
  // 加载图片
  this.load.image('hero', '/assets/hero.png');

  // 加载精灵图序列帧
  this.load.spritesheet('enemy', '/assets/enemy.png', {
    frameWidth: 32,
    frameHeight: 32,
  });

  // 加载音效 / BGM
  this.load.audio('jump_sfx', '/assets/jump.wav');
}
```

在 `src/scenes/game-scene.ts` 中直接通过 key 创建精灵：

```typescript
create() {
  this.player = this.physics.add.sprite(100, 450, 'hero');
}
```
