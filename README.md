# generate-es-index

指定した Glob パターンに従って索引ファイルを生成します。

## インストール

```sh
yarn add @yutahaga/generate-es-index
```

## 使い方

```sh
node node_modules/.bin/generate-es-index.js -v -i src/components/**/*.vue -o src/components/index.ts
```

または `package.json` の `scripts` フィールドに

```json
{
  "scripts": {
    "gji": "generate-es-index -v -s sass -p src/styles"
  }
}
```

のように記載し、書きのように実行してください。

```sh
yarn gji
```

### 出力例

```javascript
export { default as Foo } from './foo/Foo.vue';
export { default as Bar } from './bar/Bar.vue';
export { default as hogeHoge } from './hoge/hoge-hoge.vue';
```

## コマンドライン引数

### -v, --verbose

生成したファイル一覧などを標準出力に出力します。

### -i [glob pattern], --input [glob pattern]

索引したいファイルの Glob パターンを指定できます。

### -o [file path], --output [file path]

出力するファイルのファイルパスを指定します。

### -c [directory path], --cwd [directory path]

入出力の基準となるディレクトリを指定できます。
