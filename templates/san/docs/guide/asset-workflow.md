# 美术与音频素材工作流 (Asset Workflow)

## 1. 静态资源存放路径

- 模型、贴图、音效放入 `public/assets/` 目录。
- 构建时 Vite 会原样打包，在代码中直接以 `/assets/xxx.glb` 绝对路径引用。

## 2. 在 TresJS 中加载与使用

使用 `@tresjs/cientos` 提供的 `useGLTF` 加载模型，并放在 `src/game/components/` 下封装为独立组件：

```vue
<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos';

const { scene } = await useGLTF('/assets/hero.glb');
</script>

<template>
  <primitive :object="scene" />
</template>
```

异步组件需要被 `<Suspense>` 包裹。在 `src/game/scenes/main-scene.vue` 中引用：

```vue
<Suspense>
  <HeroModel />
</Suspense>
```

贴图可以使用 `useTexture('/assets/ground.png')`，音效 / BGM 可以使用浏览器 `Audio` 或自行引入音频库。
