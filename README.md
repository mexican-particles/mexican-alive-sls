# mexican-alive-sls

## 構築に関するメモ
### 1. プロジェクトの初期化

```bash
(*'-')< $ yarn create nuxt-app mexican-alive-sls
yarn create v1.21.1
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
[4/4] 🔨  Building fresh packages...
success Installed "create-nuxt-app@2.15.0" with binaries:
      - create-nuxt-app
[###########################################################################################################################################] 339/339
create-nuxt-app v2.15.0
✨  Generating Nuxt.js project in mexican-alive-sls
? Project name mexican-alive-sls
? Project description sls is alive
? Author name shztmk
? Choose programming language TypeScript
? Choose the package manager Yarn
? Choose UI framework Tailwind CSS
? Choose custom server framework Express
? Choose Nuxt.js modules Progressive Web App (PWA) Support, DotEnv
? Choose linting tools ESLint, Prettier, Lint staged files, StyleLint
? Choose test framework Jest
? Choose rendering mode Universal (SSR)
? Choose development tools (Press <space> to select, <a> to toggle all, <i> to invert selection)
yarn run v1.21.1

...
```

### 2. Nuxt.js まわりのフォルダを `/app` 以下にまとめて微調整する
- `/app` フォルダを作成し、以下のフォルダを `/app` 以下に移動する
    - assets
    - components
    - layouts
    - middleware
    - pages
    - plugins
    - static
    - store
- nuxt.config.js に `srcDir: 'app/'` を追加する
  - https://ja.nuxtjs.org/api/configuration-srcdir/
- tsconfig.js について `"baseUrl": "./app"` に変更
  - https://www.typescriptlang.org/docs/handbook/module-resolution.html#base-url
* tailwind.config.js のスタイルを直す
* nuxtconfig.js に `// eslint-disable-next-line @typescript-eslint/no-unused-vars` を追記する


### 3. Build Setup を叩いて疎通確認する

#### Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

* ここで一旦コミット
