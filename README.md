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

### 4. aws, sls コマンドを叩けるコンテナのためのファイルを追加する
- docker-compose.yaml
- Dockerfile
- Makefile
- credentials.example

### 5. credencial の設定をする

`cp -p credentials{.example,}` しておく

1. 以下のポリシーをアタッチしたグループを作成する
   - arn:aws:iam::aws:policy/AWSLambdaFullAccess
   - arn:aws:iam::aws:policy/IAMFullAccess
   - arn:aws:iam::aws:policy/AmazonAPIGatewayAdministrator
   - arn:aws:iam::aws:policy/AWSCloudFormationFullAccess
2. ユーザを上記グループに追加する
3. ユーザのアクセスキーを発行する
4. `credentials` ファイルについて、発行された値で埋める

設定値が正しく反映されているとき `make identity` でアカウント情報を確認できる  
cf. https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-configure-profiles.html

**注意： Credential 情報は、絶対にコミットに含めないこと**

* ここで一旦コミット

### 6. sls コマンドによる初期化を行う
cf. https://serverless.com/framework/docs/providers/aws/cli-reference/create/
cf. https://github.com/serverless/serverless/tree/master/lib/plugins/create/templates

```bash
(*'-')< $ docker-compose run dind sh -c "mkdir mexico && cd mexico && sls create --name mexico --template aws-nodejs-typescript"
Serverless: Generating boilerplate...
 _______                             __
|   _   .-----.----.--.--.-----.----|  .-----.-----.-----.
|   |___|  -__|   _|  |  |  -__|   _|  |  -__|__ --|__ --|
|____   |_____|__|  \___/|_____|__| |__|_____|_____|_____|
|   |   |             The Serverless Application Framework
|       |                           serverless.com, v1.67.3
 -------'

Serverless: Successfully generated boilerplate for template: "aws-nodejs-typescript"
t-kono@P325:~/repos/mexican-aliving-sls (master *)
(*'-')< $ mv .gitignore mx && echo -e "$(cat mexico/.gitignore)\n\n$(cat mx)" > .gitignore && rm -f mx
t-kono@P325:~/repos/mexican-aliving-sls (master *)
(*'-')< $ mv mexico/vscode .
t-kono@P325:~/repos/mexican-aliving-sls (master *)
(*'-')< $ mv mexico/serverless.yml .
t-kono@P325:~/repos/mexican-aliving-sls (master *)
(*'-')< $ mv mexico/webpack.config.js .
t-kono@P325:~/repos/mexican-aliving-sls (master *)
(*'-')< $ mv mexico/handler.ts ./server/
t-kono@P325:~/repos/mexican-aliving-sls (master *)
```

- よしなに `tsconfig.json` と `package.json` の設定をマージして `rm -rf mexico` する
- handler.ts について lint が通るように微調整する
- `make up && docker-compose run dind sls invoke local --function hello` でひとまずの疎通確認ができる

* ここで一旦コミット

### 7. aws-serverless-express を導入して proxy させる
- よしなに `handler.ts` を書く
- `make offline` する
- http://localhost:3000/dev にアクセスしてみる

cf. https://logaretm.com/blog/2019-08-29-cost-effective-serverless-nuxt-js/

* ここで一旦コミット

### 8. URL に付与される /stage/ を解決させる
`/server.handler.ts` の解決部分は https://github.com/kai-kou/nuxt-serverless,  
`/app/pages/**.vue` は https://github.com/tonyfromundefined/nuxt-serverless を参照している

- http://localhost:3000/local にアクセスして、リンクに正しく遷移できることを確認する

* ここで一旦コミット
