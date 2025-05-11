
# 使用方法

このスクリプトを使用してタグマーカーシステムのワールドギミックを作成する手順を説明します。

### 1. タグ表示ボードの Prefab の作成

以下のような、各プレイヤーの頭上に表示されるタグ表示ボード `PersonalTagBoard` を作成して Prefab 化します。

- ルートオブジェクトに Scriptable Item コンポーネントをアタッチし、ソースコードに `personal-tag-board` スクリプトを設定します。
- ルートオブジェクトに On Create Item Trigger コンポーネントをアタッチし、以下の 3 つの値を設定します。
  - `This.defaultOffsetY: Float`: タグ表示ボードが表示される高さを、プレイヤーの基準位置からの Y 軸方向 (高さ方向) のオフセットで指定します。デフォルトは 0 です。
  - `This.useHumanoidBone: Bool`: タグ表示ボードを表示が表示される位置の基準になるプレイヤーの基準位置にヒューマノイドボーンを使用するかどうか指定します。 True の場合、プレイヤーの Head ヒューマノイドボーンの位置を使用し、 False の場合、プレイヤー座標（足元の座標）を使用します。デフォルトは False です。ヒューマノイドボーンの位置の取得は Cluster のベータ機能です。ベータ機能の利用が許可されたワールドでのみ True を指定してください。
  - `This.useTagGroup: Bool`: 表示するタグをグループ別に管理する場合、 True にしてください。グループ内のタグが 1 つ以上表示されている場合のみ、そのグループも表示されるようになります。デフォルトは False です。
- タグとして表示するオブジェクトをサブノードに配置します。タグノードの名前は整数値のタグ ID を含む`TagX` の形式にしてください。 (例: `Tag0`, `Tag2001` `Tag-10`)
- 表示するタグをグループ別に管理する場合、タググループのサブノードを配置し、そのサブノードにタグを配置します。タググループノードの名前は整数値のタググループ ID を含む `TagGroupX` の形式にしてください。 (例: `TagGroup0`, `TagGroup20` `TagGroup-1`)
- タグとタググループのノードはデフォルトで disabled に設定しておき、タグ切り替えボタンを押したときに表示されるようにします。

### 2. コントローラーの設置

以下の手順で、ボタンと表示ボードの間のメッセージを仲介するコントローラーを設置します。

- ワールドに空の Game Object を設置し、 `TagController` とします。
- `TagController` に Scriptable Item コンポーネントをアタッチし、ソースコードに `tag-controller` スクリプトを設定します。
- `TagController` に World Item Template List コンポーネントをアタッチし、　id `personalTagBoard` に `PersonalTagBoard` の `Prefab` を設定します。

### 3. タグ切り替えボタンの設置

以下の手順で、タグ表示ボードのタグの表示を切り替えるボタンを設置します。

- ワールドに任意のコライダーを持つ Game Object を設置し、 `ToggleTagButtonX` とします。
- `ToggleTagButtonX` に Scriptable Item コンポーネントをアタッチし、ソースコードに `toggle-tag-button` スクリプトを設定します。
- `ToggleTagButtonX` に World Item Reference List コンポーネントをアタッチし、 id `tagController` にシーン中の `TagController` を設定します。
- `ToggleTagButtonX` に On Create Item Trigger コンポーネントをアタッチし、以下の 2 つの値を設定します。
  - `This.tagId: Integer`: このボタンによって表示/非表示が切り替えられるタグ ID に対応します。
  - `This.tagGroupId: Integer`: このボタンによって表示/非表示が切り替えられるタグが所属するタググループ ID に対応します。

### 4. タグクリアボタンの設置（任意）

タグ表示ボードを削除するボタンを設置します。

- ワールドに任意のコライダーを持つ Game Object を設置し、 `ClearAllTagsButton` とします。
- `ClearAllTagsButton` に Scriptable Item コンポーネントをアタッチし、ソースコードに `clear-all-tags-button` スクリプトを設定します。
- `ClearAllTagsButton` に World Item Reference List コンポーネントをアタッチし、 id `tagController` にシーン中の `TagController` を設定します。

### 5. タグ表示ボード位置調整ボタンの設置（任意）

タグ表示ボードの位置（高さ）を調整するボタン群を設置します。

- ワールドに任意のコライダーを持つ Game Object を設置し、 `ResetOffsetYButton` とします。
- `ResetOffsetYButton` に Scriptable Item コンポーネントをアタッチし、ソースコードに `reset-offset-y-button` スクリプトを設定します。
- `ResetOffsetYButton` に World Item Reference List コンポーネントをアタッチし、 id `tagController` にシーン中の `TagController` を設定します。
- ワールドに任意のコライダーを持つ Game Object を設置し、 `IncreaseOffsetYButton` や `DecreaseOffsetYButton` とします。
- `IncreaseOffsetYButton` や `DecreaseOffsetYButton` に Scriptable Item コンポーネントをアタッチし、ソースコードに `add-offset-y-button` スクリプトを設定します。
- `IncreaseOffsetYButton` や `DecreaseOffsetYButton` に World Item Reference List コンポーネントをアタッチし、 id `tagController` にシーン中の `TagController` を設定します。
-  `IncreaseOffsetYButton` や `DecreaseOffsetYButton` に On Create Item Trigger コンポーネントをアタッチし、以下の値を設定します。
  - `This.offsetY: float`: このボタンによって追加される Y 軸方向のオフセットです。デフォルトは 0 です。