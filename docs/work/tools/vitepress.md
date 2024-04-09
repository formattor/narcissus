# vitepress

[vitepress](https://vitepress.dev/zh/)

## 配置

::: tip

配置静态资源

+ 放入public `<image src="/narcissus/vitepress1.png" />`

+ [外链静态资源](/daily/web)

:::

## 使用

[详情](https://vitepress.dev/guide/markdown)

### 表格

| Left          |      Middle   |  right     |
| ------------- | :-----------: | ---------: |
| ------------- | :-----------: | ---------: |
| Left          |      Middle   |  right     |

### emoji

:tada: - `:tada:`

[emojy list](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.mjs)

### 目录结构

`[[toc]]`

[[toc]]

### Card

::: info
This is an info box. [info]
:::

::: tip
This is a tip. [tip]
:::

::: warning
This is a warning. [warning]
:::

::: danger
This is a dangerous warning. [danger]
:::

::: details
This is a details block. [details]
:::

### 行高亮
      
`js{4}`

`// [!code highlight]`


```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

### 行聚焦

::: tip

在某一行上添加 `// [!code focus]` 注释将聚焦它并模糊代码的其他部分。

此外，可以使用 `// [!code focus:<行数>]` 定义要聚焦的行数。

:::

```js
export default {
  data () {
    return {
      msg: 'Focused!' // [!code focus]
    }
  }
}
```

### 行Diff

在某一行添加 `// [!code --]` 或 `// [!code ++]` 注释将会为该行创建 diff，同时保留代码块的颜色。

```js
export default {
  data () {
    return {
      msg: 'Removed' // [!code --]
      msg: 'Added' // [!code ++]
    }
  }
}
```

### 行高亮,行警告

在某一行添加 `// [!code warning]` 或 // `[!code error]` 注释将会为该行相应的着色。

```js
export default {
  data () {
    return {
      msg: 'Error', // [!code error]
      msg: 'Warning' // [!code warning]
    }
  }
}
```

### 行号

```ts {1}
// 默认禁用行号 ts {1}
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```

```ts:line-numbers {1}
// 启用行号 ts:line-numbers {1}
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```

```ts:line-numbers=2 {1}
// 行号已启用，并从 2 开始 ts:line-numbers=2 {1}
const line3 = 'This is line 3'
const line4 = 'This is line 4'
```

### 代码组

`::: code-group`

::: code-group

``` cmd npm
npm install vitepress
```

``` cmd pnpm
pnpm install vitepress
```

:::

## 一分钟建站

### 本地搭建环境

1. 创建文件夹doc

2. 文件夹下安装vitepress
```
npm add -D vitepress
```

3. 初始化vitepress
```
npx vitepress init
```
选择建在docs文件夹下

```
◇  Where should VitePress initialize the config?
│  ./docs
```

本地下载完成，使用npm run docs:dev启动

4. 在config.mts中配置base文件路径

```
base: "/test/"
```

### 远程仓库与部署

5. 创建远程public仓库test

和base文件名称保持一致

6. 连接本地与远程仓库

```
git init
```

创建.gitignore文件
```
node_modules/
```

7. page页面配置

![vitepress1.png](https://img2.imgtp.com/2024/04/08/lAWMqdL8.png)

8. Action页面创建deploy.yml文件

::: tip 注意事项
path路径填写docs

node版本与本地一致

npm版本与本地一致
:::

::: details deploy.yml

``` yml
# 构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
#
name: Deploy VitePress site to Pages

on:
  # 在针对 `main` 分支的推送上运行。如果你
  # 使用 `master` 分支作为默认分支，请将其更改为 `master`
  push:
    branches: [main]

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      # - uses: pnpm/action-setup@v3 # 如果使用 pnpm，请取消注释
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm # 或 pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: npm ci # 或 pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: npm run docs:build # 或 pnpm docs:build / yarn docs:build / bun run docs:build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

:::

9. 成功！