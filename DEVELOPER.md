
# 開発方法

[Cluster Script](https://docs.cluster.mu/creatorkit/world/cluster-script/) を TypeScript + Bun で開発します。

## 依存関係のインストール

```bash
bun install
```

## ビルド

`scripts` ディレクトリに配置した `.ts` ファイルがビルドされます。
ビルド成果物には `import` したモジュールもバンドルされます。

```bash
bun build.ts
# OR
bun run build
```

## Cluster Script の型定義

[公式リファレンスサイトの型定義ファイル](https://docs.cluster.mu/script/#%E5%9E%8B%E5%AE%9A%E7%BE%A9%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB) をスクリプトでダウンロードできます。

最新の Cluster Creator Kit 公式の型定義に更新するには、以下のコマンドを実行します。

```bash
bun fetch-types.ts <lang>
```

型定義ファイルは `types/cluster-script.d.ts` に保存されます。

## 型定義の改良

`types/cluster-script-improved.d.ts` の内容は Cluster Creator Kit 公式の型定義ファイルを改良するためのものです。

- `$.state`, `$.groupState`, `UnityComponent.unityProp` の型をカスタム可能にする
- `$.getStateCompat()` の返り値の型を引数の `parameterType` から推定する

`$.state`, `$.groupState`, `UnityComponent.unityProp` の型をカスタム可能にするには、`types/cluster-script.d.ts` の以下の項目を編集してください。

```diff
-  groupState: StateProxy;
+  groupState: GroupStateProxy;
```

```diff
- type StateProxy = {
-   [propName: string]: Sendable;
- };
+ // type StateProxy = {
+ //   [propName: string]: Sendable;
+ // };
```

```diff
- type UnityComponentPropertyProxy = {
-   [propName: string]: UnityComponentPropertyValue;
- };
+ // type UnityComponentPropertyProxy = {
+ //   [propName: string]: UnityComponentPropertyValue;
+ // };
```

`ClusterScript.getStateCompat()` の返り値の推定を有効化するためには、 `cluster-script.d.ts` の同項目をコメントアウトしてください。

```diff
-   getStateCompat(target: CompatGimmickTarget, key: string, parameterType: CompatParamType): CompatSendable | Date | undefined;
+   // getStateCompat(target: CompatGimmickTarget, key: string, parameterType: CompatParamType): CompatSendable | Date | undefined;
```

## 型定義の拡張

`.d.ts` ファイルを追加して、 `$.state` などの型をカスタムすることができます。

カスタムした型定義はすべてのスクリプトファイルで共有されますが、実際のデータはスクリプトファイルごとに扱う必要がある点に注意してください。

```ts
interface StateProxy {
   initialized?: boolean;
   originalPosition: Vector3;
   deltaY: number
};
```

```ts
$.onUpdate((deltaTimeSec) => {
   if(!$.state.initialized){
      originalPosition = $.getPosition();
      deltaY = 0;
   }
   const newDeltaY = ($.state.deltaY + deltaTimeSec) % 1;
   // newDeltaY is inferred as number, not any
   $.state.deltaY = newDeltaY;

   const newPosition = $.state.originalPosition.clone().add(new Vector3(0, $.state.deltaY, 0));
   // newPosition is inferred as Vector3, not any
   $.setPosition(newPosition)
});
```

## ツール

`tools` ディレクトリには、開発をサポートするためのユーティリティ関数が含まれています。

### `message-handler-storage.ts`

`.onReceive` でのメッセージ処理のロジックを簡潔に管理するための関数です。

複数のメッセージタイプに対してハンドラを登録でき、受け取ったメッセージタイプに応じて登録されたハンドラが実行されます。

スクリプトの種類に合わせて、アイテム用の関数かプレイヤー用の関数を使用してください
