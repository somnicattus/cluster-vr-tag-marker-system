// "script" file for definition of ClusterScript 

/**
 * `$`オブジェクトは、Scriptで動作する個々のアイテムを操作するハンドルのインスタンスです。
 * @item
 */
declare const $: ClusterScript;

/**
 * アイテム自身を操作するハンドルです。個々のアイテムごとに存在し、`$`オブジェクトからアクセスできます。
 * @item
 */
interface ClusterScript {
  /**
   * `v`の内容をtoStringしたものをログに出力します。
   * ログの末尾には`[アイテムの名前]`が付与されます。
   * 
   * @param v
   */
  log(v: any): void;

  /**
   * データが{@link ItemHandle.send}で送信されるときのデータサイズを計算して、byte数を返します。
   *
   * データが{@link Sendable}ではない場合は{@link TypeError}が発生します。
   */
  computeSendableSize(arg: Sendable): number;

  /**
   * アイテムの移動させたい位置を指定します。値はアイテムのあるグローバル座標系で指定します。
   * 
   * アイテムには`MovableItemコンポーネント`が付いている必要があります。
   * 位置はネットワークを介して補間して同期されるため、即座に反映されない場合があることに留意してください。
   * 
   * @param v
   */
  setPosition(v: Vector3): void;

  /**
   * アイテムの現在の位置を取得します。値はアイテムのあるグローバル座標系で返されます。
   * 
   * setPositionで指定された値ではなく、移動中のアイテムの位置が返されることに留意してください。
   */
  getPosition(): Vector3;

  /**
   * アイテムの回転させたい姿勢を指定します。値はアイテムのあるグローバル座標系で指定します。
   * 
   * アイテムには`MovableItemコンポーネント`が付いている必要があります。
   * 姿勢はネットワークを介して補間して同期されるため、即座に反映されない場合があることに留意してください。
   * 
   * @example
   * ```ts
   * $.setRotation(new Quaternion().setFromEulerAngles(new Vector3(90, 0, 0)));
   * ```
   * 
   * @param v 
   */
  setRotation(v: Quaternion): void;

  /**
   * アイテムの現在の姿勢を取得します。値はアイテムのあるグローバル座標系で返されます。
   * 
   * setRotationで指定された値ではなく、移動中のアイテムの姿勢が返されることに留意してください。
   */
  getRotation(): Quaternion;

  /**
   * アイテムの子要素に含まれる、`subNodeName`に指定した名前のオブジェクトを参照するSubNodeオブジェクトを返します。
   * SubNode は子要素から再帰的に探索されます。
   * 
   * このメソッドでは [Player Local UI](https://docs.cluster.mu/creatorkit/world-components/player-local-ui/) がアタッチされたオブジェクトや、その子要素の参照はサポートされていません。
   * これは、対象となるGameObjectの階層が自動で変更される場合があるためです。
   * 
   * @param subNodeName 
   */
  subNode(subNodeName: string): SubNode;

  /**
   * アイテムのItemAudioSetListに含まれる、`itemAudioSetId`に指定したidの音声を参照するApiAudioオブジェクトを返します。
   *
   * ItemAudioSetListの詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/item-components/item-audio-set-list/)を参照してください
   * 
   * @param itemAudioSetId 
   */
  audio(itemAudioSetId: string): ApiAudio;

  /**
   * アイテムのHumanoidAnimationListに含まれる、`humanoidAnimationId`に指定したidのアニメーションを参照する{@link HumanoidAnimation}オブジェクトを返します。
   *
   * HumanoidAnimationListの詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/item-components/humanoid-animation-list/)を参照してください。
   *
   * @param humanoidAnimationId
   */
  humanoidAnimation(humanoidAnimationId: string): HumanoidAnimation;

  /**
   * アイテムのItemMaterialSetListに含まれる、`materialId`に指定したidのマテリアルを参照する{@link MaterialHandle}オブジェクトを返します。
   *
   * ItemMaterialSetListの詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/item-components/item-material-set-list/)を参照してください。
   *
   * @example
   * ```ts
   * // Interactするとマテリアルの色が変わるアイテム
   * $.onInteract(() => {
   *   const mh = $.material("materialId");
   *   mh.setBaseColor(Math.random(), Math.random(), Math.random(), 1);
   * });
   * ```
   *
   * @param materialId
   */
  material(materialId: string): MaterialHandle;

  /**
   * アイテムのWorldItemReferenceListに含まれる、`worldItemReferenceId`で指定されたアイテムを参照する{@link ItemHandle}オブジェクトを返します。
   *
   * WorldItemReferenceListの詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/item-components/world-item-reference-list/)を参照してください。
   *
   * スクリプトのトップレベルでの呼び出しとコールバックでの呼び出しの両方がサポートされます。
   *
   * @example
   * ```ts
   * // Interactすると指定したアイテムに "click" というメッセージを送信するアイテム
   * const target = $.worldItemReference("target");
   *
   * $.onInteract(() => {
   *   target.send("click", null);
   * });
   * ```
   *
   * @param worldItemReferenceId
   */
  worldItemReference(worldItemReferenceId: string): ItemHandle;

  /**
   * 空間内のアイテムを一意に表すIDの文字列表現です。
   * アイテムのItemHandleに対する{@link ItemHandle.id | ItemHandle.id}が返す値と同じです。
   */
  readonly id: string;

  /**
   * アイテムの{@link ItemHandle}を返します。
   */
  readonly itemHandle: ItemHandle;

   /**
    * クラフトアイテムの元になっているアイテムテンプレートのIDです。
    * ワールドアイテムの場合、この関数は`null`を返します。
    * {@link ClusterScript.createItem}等で利用できます。
    */
  readonly itemTemplateId: ItemTemplateId | null;

  /**
   * このアイテムが新たに空間に現れたとき、初めて`onUpdate`が実行される前に一度だけ呼ばれるcallbackを登録します。
   * `onReceive`のcallbackも登録していた場合、`onStart`が呼び出された後に呼び出されます。
   *
   * このアイテムが新たに空間に現れたときとは、以下のいずれかのことを指します。
   * - `createItem`及び`createItemGimmick`でアイテムが生成されたとき 
   * - Creator Kit製ワールドで、スペースが新規で始まるとき
   * - ワールドクラフトで、アイテムを配置もしくはコピーにより新たに生成されたとき
   * 
   * スクリプトロード時に最後に登録したcallbackのみが有効になります。
   *
   *
   * 詳細は[onStartの呼び出しルールについて](/script/#onstart%E3%81%AE%E5%91%BC%E3%81%B3%E5%87%BA%E3%81%97%E3%83%AB%E3%83%BC%E3%83%AB%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6)を参照してください 
   * @param callback 
   */
  onStart(callback: () => void): void;
  
  /**
   * updateループ毎に呼ばれるcallbackを登録します。
   * 
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   * @example
   * ```ts
   * // 10秒間隔でログを出力する。
   * $.onUpdate(deltaTime => {
   *     let t = $.state.time ?? 0;
   *     t += deltaTime;
   *     if (t > 10) {
   *         $.log("10 sec elapsed.");
   *         t -= 10;
   *     }
   *     $.state.time = t;
   * });
   * ```
   * 
   * @param callback 
   */
  onUpdate(callback: (deltaTime: number) => void): void;

  /**
   * アイテムを掴む・手放すときに呼ばれるcallbackを登録します。アイテムには`GrabbableItemコンポーネント`が付いている必要があります。
   * 
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   * @example
   * ```ts
   * $.onGrab((isGrab, isLeftHand) => {
   *   if (isGrab) {
   *     if (isLeftHand) {
   *       $.log("grabbed by left hand.");
   *     } else {
   *       $.log("grabbed by right hand.");
   *     }
   *   }
   * });
   * ```
   * アイテムを掴んだ・手放したプレイヤーのハンドルを取得できます。
   * ```ts
   * // 掴んでいる間、移動速度を上げる。
   * $.onGrab((isGrab, isLeftHand, player) => {
   *   if (isGrab) {
   *     player.setMoveSpeedRate(2);
   *   } else {
   *     player.setMoveSpeedRate(1);
   *   }
   * });
   * ```
   *
   * @param callback
   * isGrab = 掴んだときにtrue、手放したときにfalseになります。
   * 
   * isLeftHand = 左手で掴んだときや左手で手放したときにtrue、右手で掴んだときや右手で手放したときにfalseになります。
   * 
   * player = アイテムを掴んだ・手放したプレイヤーのハンドルです。
   */
  onGrab(callback: (isGrab: boolean, isLeftHand: boolean, player: PlayerHandle) => void): void;

  /**
   * 掴めないアイテムに「使う」動作をした際に呼ばれるcallbackを登録します。アイテムには1つ以上の`Colliderコンポーネント`が付いている必要があります。
   * 
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   * @example
   * ```ts
   * $.onInteract(() => {
   *   $.log("interacted.");
   * });
   * ```
   * アイテムにインタラクトしたプレイヤーのハンドルを取得できます。
   * ```ts
   * // インタラクトしたプレイヤーをリスポーンさせる。
   * $.onInteract(player => {
   *   player.respawn();
   * });
   * ```
   * 
   * @param callback 
   * player = アイテムにインタラクトしたプレイヤーのハンドルです。
   */
  onInteract(callback: (player: PlayerHandle) => void): void;

  /**
   * 掴んでいるアイテムに「使う」動作をしたときに呼ばれるcallbackを登録します。
   * アイテムには`GrabbableItemコンポーネント`が付いている必要があります。
   * また、アイテムに`UseItemTrigger`コンポーネントが付いている場合、`UseItemTrigger`コンポーネントの実行が優先され、このcallbackは呼ばれません。
   * 
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   *
   * @example
   * ```ts
   * $.onUse(isDown => {
   *   $.log(`isDown: ${isDown}.`);
   * });
   * ```
   *
   * アイテムを使ったプレイヤーのハンドルを取得できます。
   * ```ts
   * // 使ったプレイヤーに上方向の速度を加える。
   * $.onUse((isDown, player) => {
   *   if (isDown) {
   *     player.addVelocity(new Vector3(0, 5, 0));
   *   }
   * });
   * ```
   * 
   * @param callback
   * isDown = 「使う」動作を開始したときにtrue、終了したときにfalseになります。
   * 
   * player = アイテムを使ったプレイヤーのハンドルです。
   */
  onUse(callback: (isDown: boolean, player: PlayerHandle) => void): void;

  /**
   * 乗ることができるアイテムに乗る・降りるときに呼ばれるcallbackを登録します。アイテムには`RidableItemコンポーネント`が付いている必要があります。
   * 
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   * @example
   * ```ts
   * // プレイヤーが乗っている間だけ回転する。
   * $.onRide(isGetOn => {
   *   $.state.isRiding = isGetOn;
   * });
   *
   * $.onUpdate(deltaTime => {
   *   if (!$.state.isRiding) return;
   *   let t = $.state.time ?? 0;
   *   t += deltaTime;
   *   $.state.time = t % 360;
   *   $.setRotation(new Quaternion().setFromEulerAngles(0, t, 0));
   * });
   * ```
   * アイテムに乗った・降りたプレイヤーのハンドルを取得できます。
   * ```ts
   * $.onRide((isGetOn, player) => {
   *   $.state.isRiding = isGetOn;
   *   $.state.player = isGetOn ? player : null;
   * });
   * ```
   * @param callback
   * isGetOn = 乗るときにtrue、降りるときにfalseになります。
   * 
   * player = アイテムに乗った・降りたプレイヤーのハンドルです。
   */
  onRide(callback: (isGetOn: boolean, player: PlayerHandle) => void): void;

  /**
   * Grabbable Item コンポーネント が付いているアイテムを掴んでいるプレイヤーの {@link PlayerHandle} を取得します。
   * 誰もアイテムを掴んでいない場合はnullを返します。
   * 
   * {@link onGrab} のコールバックの中で呼んだ場合、 `isGrab` がtrueのときは掴んでいるプレイヤーの {@link PlayerHandle} を返し、falseのときはnullを返します。
   */
  getGrabbingPlayer(): PlayerHandle | null;

  /**
   * Ridable Item コンポーネント が付いているアイテムに乗っているプレイヤーの {@link PlayerHandle} を取得します。
   * 誰もアイテムに乗っていない場合はnullを返します。
   * 
   * {@link onRide} のコールバックの中で呼んだ場合、 `isGetOn` がtrueのときは乗っているプレイヤーの {@link PlayerHandle} を返し、falseのときはnullを返します。
   */
  getRidingPlayer(): PlayerHandle | null;

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // 生成・消滅系
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * 指定したアイテムを空間内に生成します。
   *
   * `itemTemplateId` に{@link ItemTemplateId}を渡した場合、クラフトアイテムが生成されます。
   * `itemTemplateId` に{@link WorldItemTemplateId}を渡した場合、ワールドアイテムが生成されます。
   * ただし、クラフトアイテムからの呼び出しにおいて、 `itemTemplateId` にWorldItemTemplateIdを渡した場合、エラーになります。
   * 
   * 原則、元のアイテムのオーナーが生成されたアイテムのオーナーになります。
   * 
   * ひとつのアイテムは、最大で10回/秒まで `createItem` で他のアイテムを生成することができます。
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し `createItem` は失敗します。
   *
   * #### クラフトアイテム生成時の挙動
   *
   * クラフトアイテムが実際に生成されるまでには遅延があります。
   * 
   * 生成されるクラフトアイテムのテンプレートの作者は以下のいずれかを満たす必要があります。
   * - このスクリプトを実行しているアイテムがクラフトアイテムであった場合、そのクラフトアイテムのテンプレートと作者が同じ
   * - このスクリプトを実行しているアイテムがワールドアイテムであった場合、現在の会場と作者が同じ
   * 
   * また、ベータアイテムを生成するためには、このスクリプトを実行しているアイテムがベータアイテムである、もしくはベータワールドのワールドアイテムである必要があります。
   * 
   * クラフトアイテムの生成は、以下のような要因で失敗する可能性があります。
   * - 生成できる条件を満たさないクラフトアイテムを生成しようとした場合。
   * - クラフト容量が500%を超えるような生成を行おうとした場合。
   * - アイテムの生成中に元のアイテムのオーナーが退出した場合。
   * 
   * クラフトアイテムの生成に失敗した場合、返り値の ItemHandle は指している先が存在しない状態になり、 {@link ItemHandle.exists | ItemHandle.exists} がfalseを返すようになります。
   *
   * #### ワールドアイテム生成時の挙動
   * 
   * [World Item Template List](https://docs.cluster.mu/creatorkit/item-components/world-item-template-list/)で登録した[ワールドアイテムテンプレート](https://docs.cluster.mu/creatorkit/item/about-item/#ワールドアイテムテンプレート)を参照してアイテムを生成します。
   * 
   * クラフトアイテムからワールドアイテムを生成することはできません。
   *
   * World Item Template Listで登録されていないIdを指定した場合や、World Item Templateが設定されていないIdを指定した場合は、{@link ClusterScriptError}が発生しcreateItemは失敗します。
   *
   * ワールドアイテムの生成中に元のアイテムのオーナーが退出した場合、生成に失敗する可能性があります。
   *
   * ワールドアイテムの生成に失敗した場合、返り値の ItemHandle は指している先が存在しない状態になり、 {@link ItemHandle.exists | ItemHandle.exists} がfalseを返すようになります。
   *
   * @example
   * 以下の例では、アイテムが使用されるとプレイヤーの上空にマーカーのワールドアイテムを生成し、作成したプレイヤーのPlayerHandleを送っています。
   * ```ts
   * $.onUse((isDown, player) => {
   *   if (!isDown) return;
   *
   *   const markerPosition = player.getPosition();
   *   markerPosition.y += 2.5;
   *
   *   const markerRotation = player.getRotation();
   *
   *   const worldItemTemplateId = new WorldItemTemplateId("marker");
   *   const itemHandle = $.createItem(worldItemTemplateId, markerPosition, markerRotation);
   *
   *   itemHandle.send("createdPlayer", player);
   * });
   * ```
   * 
   * @param itemTemplateId 生成されるアイテムのTemplateId
   * @param position 生成位置 (グローバル座標)
   * @param rotation 生成姿勢 (グローバル座標)
   */
  createItem(itemTemplateId: ItemTemplateId | WorldItemTemplateId, position: Vector3, rotation: Quaternion): ItemHandle;

  /**
   * @beta
   * オプションを指定してアイテムを生成します。
   * 
   * @example
   * ```ts
   * let itemHandle = $.createItem(templateId, position, rotation, { asMember: true });
   * ```
   * 
   * @param itemTemplateId 生成されるアイテムのTemplateId
   * @param position 生成位置 (グローバル座標)
   * @param rotation 生成姿勢 (グローバル座標)
   * @param option オプション値
   */
  createItem(itemTemplateId: ItemTemplateId | WorldItemTemplateId, position: Vector3, rotation: Quaternion, option: CreateItemOption): ItemHandle;

  /**
   * アイテム自身を破棄します。アイテムが実際に破棄されるまでに遅延があります。
   * 
   * destroyで破棄するアイテムは以下のいずれかを満たす必要があります。
   * - クラフトアイテムである
   * - クラフトアイテムでない場合、 Create Item Gimmick や Scriptable Item の ClusterScript.createItem で動的に生成されたアイテムである
   *
   * destroyできないアイテムに対して呼び出した場合、{@link ClusterScriptError} (`executionNotAllowed`)が発生してdestroyは失敗します。
   * 現状では、[ワールド設置アイテム](https://docs.cluster.mu/creatorkit/item/about-item/#ワールド設置アイテム)をdestroyすることはできません。
   */
  destroy(): void;

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // 近傍取得・衝突判定
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * 指定した球状の空間内に検知可能なコライダーが存在する自身を除くアイテムのハンドルの一覧を返します。
   * 検知可能なコライダーは、PhysicalShapeが付いているコライダー、OverlapSourceShapeが付いているコライダー、Shapeが付いていない物理衝突をするコライダーです。
   * 検知対象となるレイヤーはDefault, RidingItem, InteractableItem, GrabbingItemレイヤーです。
   *
   * 大量のコライダーが範囲に含まれる場合に、条件を満たしたすべてのItemHandleを取得できない場合があります。
   * この場合、コンソールに警告メッセージが出力されます。
   * 
   * @param position 中心 (グローバル座標)
   * @param radius 半径
   * 
   * @returns 検知したアイテムのハンドルの配列 (順序は未定義)
   */
  getItemsNear(position: Vector3, radius: number): ItemHandle[];

  /**
   * 指定した球状の空間内のコライダーが存在するプレイヤーのハンドルの一覧を返します。
   * 
   * @param position 中心 (グローバル座標)
   * @param radius 半径
   * 
   * @returns 検知したプレイヤーのハンドルの配列 (順序は未定義)
   */
  getPlayersNear(position: Vector3, radius: number): PlayerHandle[];

  /**
   * レイが最初に衝突した物体を取得します。
   *
   * @example
   * ```ts
   * // アイテムのローカル座標系のZ軸正方向にレイを飛ばし、ヒットした一番近くの物体をログに出力する
   * let direction = new Vector3(0, 0, 1).applyQuaternion($.getRotation());
   * let result = $.raycast($.getPosition(), direction, 10);
   * if (result === null) {
   *   $.log("ray hits nothing");
   * } else if (result.handle === null) {
   *   $.log("ray hits something other than player or item");
   * } else if (result.handle.type === "player") {
   *   $.log("ray hits player " + result.handle.userDisplayName);
   * } else if (result.handle.type === "item") {
   *   $.log("ray hits item " + result.handle.id);
   * }
   * ```
   *
   * @param position レイの原点 (グローバル座標)
   * @param direction レイの方向 (グローバル座標)
   * @param maxDistance 衝突判定を行う最大距離
   * 
   * @returns 衝突した物体 (衝突しなかった場合はnull)
   */
  raycast(position: Vector3, direction: Vector3, maxDistance: number): RaycastResult | null;

  /**
   * レイが衝突した全ての物体を取得します。
   *
   * 大量のコライダーが範囲に含まれる場合に、条件を満たしたすべてのItemHandleを取得できない場合があります。
   * この場合、コンソールに警告メッセージが出力されます。
   *
   * @example
   * ```ts
   * // 真下にレイを飛ばし、ヒットした一番近くのアイテムでもプレイヤーでもない座標にアイテム自身を移動する
   * let raycastResults = $.raycastAll($.getPosition(), new Vector3(0, -1, 0), 10);
   * let result = null;
   * let minDistance = Infinity;
   * for (let raycastResult of raycastResults) {
   *   if (raycastResult.handle !== null) continue;
   *   var distance = raycastResult.hit.point.clone().sub(pos).length();
   *   if (distance >= minDistance) continue;
   *   result = raycastResult;
   *   minDistance = distance;
   * }
   * if (result != null) {
   *   $.setPosition(result.hit.point);
   * }
   * ```
   *
   * @param position レイの原点 (グローバル座標)
   * @param direction レイの方向 (グローバル座標)
   * @param maxDistance 衝突判定を行う最大距離
   * 
   * @returns 衝突した物体の配列 (順序は未定義)
   */
  raycastAll(position: Vector3, direction: Vector3, maxDistance: number): RaycastResult[];

  /**
   * このアイテムが別の物体と衝突したタイミングで呼ばれるcallbackを設定します。アイテムは物理挙動をする必要があります。
   * 
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   * @example
   * ```ts
   * $.onCollide(collision => {
   *   if (collision.handle?.type === "player") {
   *     $.log("collide with a player.");
   *   }
   * });
   * ```
   */
  onCollide(callback: (collision: Collision) => void): void;

  /**
   * このアイテムのOverlapDetectorShapeに重なっている、検知対象となる物体を取得します。
   * 検知対象となる物体は、PhysicalShapeが付いているコライダー、OverlapSourceShapeが付いているコライダー、Shapeが付いていない物理衝突をするコライダーです。
   * このアイテム自身との重なりは含まれません。
   * 
   * このアイテムもしくは検知対象となる物体のどちらかは、MovableItemであるか、Rigidbodyが付いているか、CharacterControllerがついているか、プレイヤーであるかのいずれかを満たす必要があります。
   * このアイテムのOverlapDetectorShapeが衝突判定するレイヤーが検知対象となります。
   * アイテムの生成時点ですでに重なっていたり、重なっている状態で有効化された場合など、空間的には重なっている場合にもこのメソッドの返り値に含まれない場合があります。
   * @example
   * ```ts
   * // 自分と重なっているプレイヤーを数える。
   * let set = new Set();
   * let overlaps = $.getOverlaps();
   * for (let overlap of overlaps) {
   *   if (overlap.handle?.type === "player") {
   *     let player = overlap.handle;
   *     set.add(player.id);
   *   }
   * }
   * $.log(`player count: ${set.size}`);
   * ```
   */
  getOverlaps(): Overlap[];

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // 物理系
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * このアイテムの物理状態が更新されるタイミングで呼ばれるcallbackを設定します。
   * (UnityではFixedUpdateに対応します)
   * 
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   * @example
   * ```ts
   * // 1秒間上昇して2秒かけて落下する。
   * // RigidbodyのMassが1であることが想定されています。
   * $.onPhysicsUpdate(deltaTime => {
   *   let t = $.state.time ?? 0;
   *   t += deltaTime;
   *   if (t < 1) {
   *     $.addForce(new Vector3(0, 12, 0));
   *   } else if (t > 3) {
   *     t = 0;
   *   }
   *   $.state.time = t;
   * });
   * ```
   */
  onPhysicsUpdate(callback: (deltaTime: number) => void): void;

  /**
   * このアイテムが、通常時に重力の影響を受けるかを取得・変更します。
   * Grab中などはアイテムは重力の影響を受けませんが、`useGravity`には影響がありません。
   * 
   * 物理挙動をするMovableItemでない場合、falseを返します。
   * 物理挙動をするMovableItemでない場合、変更しようとすると例外になります。
   */
  useGravity: boolean;

  /**
   * アイテムの速度(グローバル座標)を取得・変更します。
   * 
   * MovableItemでない場合は0ベクトルを返します。
   * 物理挙動をするMovableItemでない場合、変更しようとすると例外になります。
   * Grab中などに行われた変更は無視されます。
   */
  velocity: Vector3;

  /**
   * アイテムの角速度(グローバル座標)を取得・変更します。
   * 
   * MovableItemでない場合は0ベクトルを返します。
   * 物理挙動をするMovableItemでない場合、変更しようとすると例外になります。
   * Grab中などに行われた変更は無視されます。
   */
  angularVelocity: Vector3;

  /**
   * アイテムの重心に、現在のPhysicsUpdate中で有効な力を加えます。
   * {@link ClusterScript.onPhysicsUpdate}のコールバック内部でのみ使用可能で、それ以外の箇所で呼び出すと例外になります。
   * 
   * @param force 力 (グローバル座標)
   */
  addForce(force: Vector3): void;

  /**
   * アイテムの重心に、現在のPhysicsUpdate中で有効なトルクを加えます。
   * {@link ClusterScript.onPhysicsUpdate}のコールバック内部でのみ使用可能で、それ以外の箇所で呼び出すと例外になります。
   * 
   * @param torque トルク (グローバル座標)
   */
  addTorque(torque: Vector3): void;

  /**
   * アイテムの指定位置に、現在のPhysicsUpdate中で有効な力(グローバル座標)を加えます。
   * {@link ClusterScript.onPhysicsUpdate}のコールバック内部でのみ使用可能で、それ以外の箇所で呼び出すと例外になります。
   * 
   * @param force 力 (グローバル座標)
   * @param position 力点 (グローバル座標)
   */
  addForceAt(force: Vector3, position: Vector3): void;

  /**
   * アイテムの重心に撃力を加えます。
   * 重心以外に撃力を加えたい場合は{@link ClusterScript.addImpulsiveForceAt}を使用してください。
   * 
   * @param impulsiveForce 撃力 (グローバル座標)
   */
  addImpulsiveForce(impulsiveForce: Vector3): void;

  /**
   * アイテムの重心に角力積を加えます。
   * 
   * @param impulsiveTorque 角力積 (グローバル座標)
   */
  addImpulsiveTorque(impulsiveTorque: Vector3): void;

  /**
   * アイテムの指定位置に撃力を加えます。
   * 
   * @param impulsiveForce 撃力 (グローバル座標)
   * @param position 力点 (グローバル座標)
   */
  addImpulsiveForceAt(impulsiveForce: Vector3, position: Vector3): void;


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // state系
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * {@link ItemHandle.send | ItemHandle.send}、または{@link PlayerScript.sendTo | PlayerScript.sendTo}で{@link ItemId | ItemId}宛てに送られたメッセージを受け取ったときに呼ばれるcallbackを登録します。
   *
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   *
   * `option`の指定によって、 {@link PlayerScript.sendTo | PlayerScript.sendTo} から送信されたメッセージを受け取ることができます。
   * {@link PlayerScript.sendTo | PlayerScript.sendTo} から送信されたメッセージを受け取る場合は、引数の `option` を設定してください。
   *
   * optionが未設定の場合、{@link ItemHandle.send | ItemHandle.send}からのメッセージのみ受け取ります。
   *
   * - `option.item` が `true` の場合、{@link ItemHandle.send | ItemHandle.send} から送信されたメッセージを受け取ります。
   * - `option.item` が `false` の場合、{@link ItemHandle.send | ItemHandle.send} から送信されたメッセージを無視します。
   * - `option.item` が未設定の場合、{@link ItemHandle.send | ItemHandle.send} から送信されたメッセージを受け取ります。
   * - `option.player` が `true` の場合、{@link PlayerScript.sendTo | PlayerScript.sendTo} から送信されたメッセージを受け取ります。
   * - `option.player` が `false` の場合、{@link PlayerScript.sendTo | PlayerScript.sendTo} から送信されたメッセージを無視します。
   * - `option.player` が未設定の場合、{@link PlayerScript.sendTo | PlayerScript.sendTo} から送信されたメッセージを無視します。
   *
   * `option.player`が未設定の場合の扱いは{@link PlayerScript.onReceive | PlayerScript.onReceive}と異なります。
   * `ClusterScript.onReceive`では既存のスクリプトの互換性を破壊しないためにオプションが未設定の場合はPlayerScriptからのメッセージは受け取りません。
   *
   * コールバックに渡される `sender` の値は ItemHandle または PlayerHandle です。
   * この値の取り扱い方はScript Referenceトップページの [ハンドル](/script/#%E3%83%8F%E3%83%B3%E3%83%89%E3%83%AB) も参照してください。
   *
   * @example
   * ```ts
   * // 送られたメッセージがdamageかhealのときに、ログを出力する。
   * $.onReceive((messageType, arg, sender) => {
   *   switch (messageType) {
   *     case "damage":
   *       $.log(`damage: ${arg}`);
   *       break;
   *     case "heal":
   *       $.log(`heal: ${arg}`);
   *       break;
   *   }
   * });
   * ```
   *
   * @example
   * ```ts
   * // PlayerScriptからのattackメッセージを受け取りログを出力する。
   * $.onReceive((messageType, arg, sender) => {
   *   if (messageType === "attack") {
   *     if (sender instanceof ItemHandle) {
   *       $.log(`attack: ${arg}`);
   *     }
   *   }
   * }, { player: true });
   * ```
   *
   * @param callback senderは送信元のアイテムまたはプレイヤーを表します。
   * @param option コールバックの登録のオプションです。受け取るメッセージの種類を指定できます。
   */
  onReceive(callback: (messageType: string, arg: Sendable, sender: ItemHandle | PlayerHandle) => void, option?: { player: boolean, item: boolean }): void;

  /**
   * {@link PlayerHandle.requestTextInput | PlayerHandle.requestTextInput}で要求した文字列入力の応答を受け取ったときに呼ばれるcallbackを登録します。
   * 
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   * @example
   * ```ts
   * $.onTextInput((text, meta, status) => {
   *   switch(status) {
   *     case TextInputStatus.Success:
   *       $.log(text);
   *       break;
   *     case TextInputStatus.Busy:
   *       // 5秒後にretryする
   *       $.state.should_retry = true;
   *       $.state.retry_timer = 5;
   *       break;
   *     case TextInputStatus.Refused:
   *       // 拒否された場合は諦める
   *       $.state.should_retry = false;
   *       break;
   *   }
   * });
   * ```
   * @param callback 
   * text = プレイヤーが入力した文字列です。文字列のサイズは1000byte以下かつ文字数は250以下（ただしASCIIは1文字当たり0.5文字として換算します）です。
   * 
   * meta = {@link PlayerHandle.requestTextInput | PlayerHandle.requestTextInput}で指定したmeta文字列です。
   * 
   * status = 文字列入力が成功したかどうかを示すステータスです。
   */
  onTextInput(callback: (text: string, meta: string, status: TextInputStatus) => void): void;

  /**
   * {@link PlayerHandle.requestPurchase | PlayerHandle.requestPurchase}で要求したワールド内商品購入リクエストの結果を受け取ったときに呼ばれるcallbackを登録します。
   *
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   *
   * @param callback
   * meta = {@link PlayerHandle.requestPurchase | PlayerHandle.requestPurchase}で指定したmeta文字列です。
   *
   * status = ワールド内商品購入の結果を示すステータスです。
   *
   * errorReason = status が {@link PurchaseRequestStatus.Unknown | PurchaseRequestStatus.Unknown } 、 {@link PurchaseRequestStatus.NotAvailable | PurchaseRequestStatus.NotAvailable } または {@link PurchaseRequestStatus.Failed | PurchaseRequestStatus.Failed } の場合、失敗理由を示す追加の情報を返します。
   * status がそれ以外の場合、 null を返します。
   *
   * player = ワールド内商品購入をリクエストされたプレイヤーです。
   */
  onRequestPurchaseStatus(callback: (meta: string, status: PurchaseRequestStatus, errorReason: string | null, player: PlayerHandle) => void): void;

  /**
   * スペース内のプレイヤーについて、ワールド内商品の所持状況が変化した際に呼ばれるcallbackを登録します。
   * このcallbackを登録するだけでは何も起きません。
   * {@link ClusterScript.subscribePurchase | ClusterScript.subscribePurchase}による商品の登録を行うことで、指定した商品IDに関してcallbackが呼び出されるようになります。
   * 
   * 所持状況が変化した内容を取得するために、{@link ClusterScript.getOwnProducts | ClusterScript.getOwnProducts}を利用できます。
   * 
   * 一部の状況で、商品の所持状況が変化したにもかかわらずcallbackが呼ばれないことがあります。
   * onPurchaseUpdated以外の手段でもgetOwnProductを呼ぶことで、
   * callbackが呼ばれなかった場合や商品を既に購入したプレイヤーがスペースに入室した場合にも所持状況がワールドに反映されるように実装してください。
   * 
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   *
   * @param callback
   * player = 商品の所持状況が変化したプレイヤーです。
   * productId = 対象の商品IDです。
   */
  onPurchaseUpdated(callback: (player: PlayerHandle, productId: string) => void): void;

  /**
   * {@link ClusterScript.onPurchaseUpdated | ClusterScript.onPurchaseUpdated} で所持状況の変化を検知する商品を登録します。
   * このAPIはスクリプトのトップレベルで呼び出すことはできません。
   *
   * @param productId 所持状況の変化を検知する商品のIDです。
   */
  subscribePurchase(productId: string): void;

  /**
   * {@link ClusterScript.onPurchaseUpdated | ClusterScript.onPurchaseUpdated} で所持状況の変化を検知する商品の登録を解除します。
   * このAPIはスクリプトのトップレベルで呼び出すことはできません。
   *
   * @param productId 所持状況の変化を検知する商品のIDです。
   */
  unsubscribePurchase(productId: string): void;

  /**
   * {@link ClusterScript.getOwnProducts | ClusterScript.getOwnProducts}で要求したワールド内商品の所持状況を取得した際に呼ばれるcallbackを登録します。
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   *
   * プレイヤーが対象の商品を購入したことがある場合、callbackのownProductsに所持状況が渡されます。
   * プレイヤーが対象の商品を購入したことがない場合、プレイヤーに対応するOwnProductは配列に含まれません。
   *
   * #### ルーム種別による挙動の違い:
   *
   * テスト用のスペースで呼び出された場合、callback の ownProducts にはテスト用のスペースで行った商品購入などによる所持状況のみが渡されます。テスト用のスペースでの所持状況はそれ以外のスペースの所持状況とは別で管理されており、テスト用のスペースでの商品購入などはそれ以外のスペースの所持状況に影響を与えません。
   *
   * イベント会場で呼び出された場合、 callback の ownProducts は常に空の配列が渡されます
   *
   * @param callback ownProducts: 取得に成功した商品の所持状況です。失敗した場合はnullです。 meta: getOwnProductsの時に渡したものと同じ文字列です。errorReason: responseがnullの場合、失敗の理由。
   */
  onGetOwnProducts(callback: (ownProducts: OwnProduct[] | null, meta: string, errorReason: string | null) => void): void;

  /**
   * アイテムごとのstateへのアクセスを提供します。
   * read/writeアクセスが可能です。stateのプロパティへのアクセスにより、そのプロパティ名をkeyとしてstateへアクセスすることができます。
   * 
   * @example
   * 未定義のプロパティをreadしたときは`undefined`が初期値になります。
   * ```ts
   * let v = $.state.exampleKey; // "exampleKey"というkeyの値を読み込む。1度も書き込んでいないとき、値はundefined
   * if (v === undefined) { v = 0.0; }
   * $.state.exampleKey = v + 1;
   * ```
   * 
   * stateには {@link Sendable} 型の値を書き込み保存することができます。
   *
   * 具体的には、数値、文字列、boolean、{@link Vector2}、{@link Vector3}、{@link Quaternion}、{@link PlayerHandle}、{@link ItemHandle}、そしてそれらの配列と文字列をキーとしたobjectが利用可能です。
   * 
   * `undefined` などのSendableではない値を書き込もうとした場合、無視されます。
   * この挙動は将来的に変更される可能性があります。
   * 
   * @example
   * ```ts
   * $.state.exampleKey1 = 1; // numberを書き込む
   * $.state.exampleKey2 = "hello"; // stringを書き込む
   * $.state.exampleKey3 = true; // booleanを書き込む
   * $.state.exampleKey4 = { foo: "bar" }; // objectを書き込む
   * $.state.exampleKey5 = [1, 2, 3]; // arrayを書き込む
   * $.state.exampleKey6 = { // 複雑なオブジェクトを書き込む
   *   array: [1, 2, 3],
   *   object: { foo: "bar" },
   * };
   * ```
   * 
   * @example
   * 配列やオブジェクトなどをstateに反映させるためには再代入が必要です。
   * ```ts
   * $.state.exampleKey = [1, 2, 3];
   * // $.state.exampleKey.push(4); // このように書いてもstateに反映されない
   * 
   * // このように書くとstateに反映される
   * const v = $.state.exampleKey;
   * v.push(4);
   * $.state.exampleKey = v;
   * ```
   */
  state: StateProxy;


  /**
   * @beta
   * group stateへのアクセスを提供します。
   * {@link state} と同じようにread/writeアクセスが可能ですが、値はアイテムグループに所属する全てのアイテムで共有されます。
   * 
   * アイテムグループに所属していない場合、{@link ClusterScriptError}が発生します。
   * 
   * アイテムグループの詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/world/item/item-group/)を参照してください。
   */
  groupState: GroupStateProxy;

  /**
   * Creator Kit 製ワールドで対象のメッセージを取得します。
   * Creator Kitのワールドに組み込まれたアイテムでしか利用できません。
   * クラフトアイテムで実行した場合はエラーになります。
   * 
   * @example
   * ```ts
   * // 自身のアイテムを対象に foo という識別子の boolean 型のメッセージを取得する。
   * $.getStateCompat("this", "foo", "boolean");
   * ```
   * 
   * @param target メッセージを取得する対象
   *
   * `"this"`: このアイテムへのメッセージを取得します。
   *
   * `"owner"`: このアイテムのオーナーへのメッセージを取得します。
   *
   * `"global"`: Globalへのメッセージを取得します。
   *
   * @param key メッセージの識別子
   * @param parameterType メッセージの型
   *
   * `"signal"`, `"boolean"`, `"float"`, `"double"`, `"integer"`, `"vector2"`, `"vector3"` が利用できます。
   * 
   * @returns
   * `parameterType` に `"signal"` を指定した場合、シグナルが通知された日時を `Date` として返します。\
   * それ以外の場合、メッセージの値を返します。メッセージの値が存在する場合、それは数値, boolean, {@link Vector2}, {@link Vector3} のうちいずれかです。
   */
  // getStateCompat(target: CompatGimmickTarget, key: string, parameterType: CompatParamType): CompatSendable | Date | undefined;

  /**
   * Creator Kit 製ワールドで対象にメッセージを通知します。
   * Creator Kitのワールドに組み込まれたアイテムでしか利用できません。
   * クラフトアイテムで実行した場合はエラーになります。
   * 
   * @example
   * ```ts
   * // 自身のアイテムを対象に foo という識別子で boolean型のメッセージを通知する。
   * $.setStateCompat("this", "foo", true);
   * ```
   * 
   * @param target メッセージを通知する対象
   *
   * `"this"`: このアイテムへメッセージを通知します。
   *
   * `"owner"`: このアイテムのオーナーへメッセージを通知します。
   *
   * @param key メッセージの識別子
   * @param value メッセージの値
   * 
   * 数値, boolean, {@link Vector2}, {@link Vector3} が利用できます。
   */
  setStateCompat(target: CompatStateTarget, key: string, value: CompatSendable): void;

  /**
   * Creator Kit 製ワールドで対象にシグナルを通知します。
   * Creator Kitのワールドに組み込まれたアイテムでしか利用できません。
   * クラフトアイテムで実行した場合はエラーになります。
   * 
   * @param target メッセージを通知する対象
   *
   * `"this"`: このアイテムへメッセージを通知します。
   *
   * `"owner"`: このアイテムのオーナーへメッセージを通知します。
   *
   * @param key メッセージの識別子
   */
  sendSignalCompat(target: CompatStateTarget, key: string): void;


  /**
   * アイテムのオーナーであるプレイヤーを取得します。
   * オーナーについての詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/world/item/owner/)を参照してください。
   * @beta
   */
  getOwner(): PlayerHandle;

  /**
   * アイテムのオーナーの変更をリクエストします。
   * オーナーについての詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/world/item/owner/)を参照してください。
   * 
   * オーナーの変更には時間がかかる可能性があります。
   * プレイヤーがアイテムを掴む、乗る、クラフトモードで操作する、またはスクリプトを編集している場合は、オーナーの変更は失敗します。
   * また、対象のプレイヤーの通信状況や他のプレイヤーからのインタラクションなどの要因によって失敗する可能性があります。
   * 
   * #### 頻度の制限:
   * 
   * ひとつのアイテムは、最大で10回/秒までオーナーの変更をリクエストできます。
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * @param player 新しくオーナーにするプレイヤー
   * @beta
   */
  requestOwner(player: PlayerHandle): void;

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // 外部通信
  ////////////////////////////////////////////////////////////////////////////////////////////////////

   /**
   * {@link ClusterScript.callExternal}が完了した場合に呼ばれるcallbackを登録します。
   * callbackはcallExternalの成功時または失敗時に一回ずつ呼び出されます。
   *
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   *
   * @param callback response: 外部から取得したレスポンス。失敗した場合はnullです。 meta: callExternalの時に渡したものと同じ文字列です。errorReason: responseがnullの場合、失敗の理由。
   */
  onExternalCallEnd(callback: (response: string | null, meta: string, errorReason: string | null) => void): void;

  /**
   * 空間の外部にリクエストを送信します。
   * レスポンスは{@link ClusterScript.onExternalCallEnd}で受け取ります。
   * この呼び出しを利用するためには、開発者自身が外部のサーバーを用意する必要があります。
   *
   * 外部通信機能についてはドキュメントの[外部通信](https://docs.cluster.mu/creatorkit/world/manage-data/call-external/)の説明もあわせて参照してください。
   * 
   * ### 頻度の制限:
   *
   * `callExternal`の呼び出し自体には頻度の制限はありませんが、外部サーバーが応答可能な頻度である必要があります。
   * 高負荷で応答ができていないと思われる場合は、制限やお問い合わせさせていただく場合があります。
   *
   * ### 流量制御:
   *
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   *
   * ### 流量制御による制限:
   *
   * `callExternal`が動作するためには、流量制御による遅延が30秒以下である必要があります。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   *
   * ### 容量の制限:
   * requestやmetaがサイズ制限を超えている場合、{@link ClusterScriptError} (`requestSizeLimitExceeded`) が発生します。
   *
   * ### 設定
   * `callExternal`を利用するには、EndpointとVerify Tokenが必要です。
   * EndpointとVerify TokenはCreator Kitの `外部通信(callExternal)接続先URL` から登録および作成できます。
   * 
   * Endpointで外部サーバーがリクエストを受け取るエンドポイントURLを指定します。
   * Endpointはアカウントごとに最大100個登録できます。
   * 
   * Verify Tokenは開発者自身がEndpointを管理していることを確認するために利用されます。
   * Verify Tokenはアカウントごとに最大2個登録できます。
   * 
   * ### 利用方法
   * リクエストはそのアイテム・ワールドをアップロードしたアカウントに紐付く、endpointIdで指定されたエンドポイントに送信されます。
   *
   * Cluster Scriptから`callExternal`が呼ばれるたびに、エンドポイントに対してclusterのサーバーからHTTP POST呼び出しが行われます。
   * POSTに対するresponseに含まれるデータが`onExternalCallEnd`に渡されます。
   * エンドポイントが5秒のタイムアウトを超えても応答しない場合、またエラーを返した場合、失敗と判定されます。
   * clusterからエンドポイントに対するリトライは行いません。
   *
   * ### エンドポイントの仕様
   * 以下の形式でHTTP POSTに応答する必要があります。
   * 対応しているのはHTTP/1.1およびHTTP/2のみで、HTTP/3による呼び出しには対応していません。
   * HTTPもしくはHTTPSに対応していますが、公開時にはセキュリティ向上のためHTTPSの利用を推奨します。
   *
   * **リクエスト**
   * ```json
   * {
   *   "request": "...100kB以下の文字列..."
   * }
   * ```
   *
   * **レスポンス**
   * ```json
   * {
   *   "verify": "...verify_token (Creator Kitで取得できます)...",
   *   "response": "...100kB以下の文字列..."
   * }
   * ```
   *
   * verifyフィールドには、アカウントに紐づくいずれかのVerify Tokenを指定してください。
   *
   * 以下の場合、不正な応答とみなし、`callExternal`は失敗として扱われます。
   * 
   * - responseフィールドが100kBを超えていた場合
   * - verifyフィールドにいずれかの有効なVerify Tokenが指定されていなかった場合
   *
   * 不正な応答などでEndpointの所有が確認できない場合はcallExternal APIの利用を制限させていただきます。
   * 高負荷で応答ができていないと思われる場合なども、同様に制限やお問い合わせさせていただく場合があります。
   *
   * ### プライバシー
   * プレイヤーの個人情報に該当する情報をプレイヤーの同意なく外部に送信することは禁止されています。
   * そのような利用が疑われる場合、callExternal APIの利用の制限や利用目的のお問い合わせをさせていただく場合があります。
   * また、当社が不適切と判断した場合、予告なく利用を制限させていただく場合もあります。
   *
   * @param endpointId 送信先となる外部のサーバーを指定するEndpointのIDです。
   * @param request 100kB以下の文字列です。外部のサーバーに送信されます。
   * @param meta 100 byte以下の文字列です。複数の`callExternal`呼び出しを識別するために利用できます。空文字や、同じ文字列を複数回指定しても問題ありません。
   */
  callExternal(endpointId: ExternalEndpointId, request: string, meta: string): void;

  /**
   * 送信先のエンドポイントを指定せずに空間の外部にリクエストを送信します。 \
   * リクエストはCreator Kitの旧バージョンの`外部通信(callExternal)接続先URL`で登録されたエンドポイントに送信されます。
   *
   * @deprecated
   * このAPIは Creator Kit v2.32.0 以降では非推奨です。 \
   * 代わりに、 {@link ClusterScript.callExternal:0 | ClusterScript.callExternal(ExternalEndpointId, string, string)} を利用してください。
   *
   * @param request 100kB以下の文字列です。外部のサーバーに送信されます。
   * @param meta 100 byte以下の文字列です。複数の`callExternal`呼び出しを識別するために利用できます。空文字や、同じ文字列を複数回指定しても問題ありません。
   */
  callExternal(request: string, meta: string): void;

  /**
   * アイテムのPlayerScriptコンポーネントが持つスクリプトをプレイヤーに登録します。
   * アイテムにPlayerScriptコンポーネントがついていない場合は例外を投げます。
   *
   * PlayerScriptコンポーネントの詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/item-components/player-script/)を参照してください。
   *
   * このアイテムが削除されると、スクリプトの登録は解除されます。
   * 同一のプレイヤーに対して複数回setPlayerScriptメソッドが呼ばれた場合、先に登録されていたスクリプトは削除され、最後に登録されたスクリプトだけが実行されます。
   *
   * 登録されたスクリプトからは、{@link PlayerScript.sourceItemId | PlayerScript.sourceItemId}を使うことで、スクリプトを登録したアイテムの参照を取得することができます。
   * 
   * #### 流量制御
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   * 
   * #### クラフトアイテムの PlayerScript
   *
   * クラフトアイテムでは `setPlayerScript` はベータ機能です。
   */
  setPlayerScript(playerHandle: PlayerHandle): void;

  /**
   * プレイヤーがこのワールドで購入したワールド内商品の所持状況を非同期で取得します。
   * 取得した所持状況は {@link ClusterScript.onGetOwnProducts | ClusterScript.onGetOwnProducts}に設定したcallbackに渡されます。
   *
   * プレイヤーが対象の商品を購入したことがある場合、コールバックのownProductsに所持状況が渡されます。
   * プレイヤーが対象の商品を購入したことがない場合、プレイヤーに対応するOwnProductは配列に含まれません。
   *
   * #### 頻度の制限:
   * ワールド内商品の所持状況を取得できる頻度には制限があります。
   * - このスクリプトを実行しているアイテムがクラフトアイテムであった場合、ひとつのアイテムあたり5回/分
   * - このスクリプトを実行しているアイテムがワールドアイテムであった場合、ひとつのスペースあたり全てのワールドアイテムの合計で100回/分
   * 
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * @param productId 取得する商品IDです。
   * @param players 所持状況を取得する対象のプレイヤーです。
   * @param meta 100 byte以下の文字列です。複数のgetOwnProducts呼び出しを識別するために利用できます。空文字や、同じ文字列を複数回指定しても問題ありません。
   */
  getOwnProducts(productId: string, players: PlayerHandle | PlayerHandle[], meta: string): void;

  /**
   * @beta
   *
   * このアイテムを見ることができるプレイヤーを設定します。
   *
   * このメソッドを呼び出す前はItemは全員に見える設定です。
   *
   * このメソッドを呼び出した場合、以前にこのメソッドで設定したアイテムを見ることのできるプレイヤーの設定は上書きされます。
   *
   * 変更されるのは見た目が見えるかどうかとInteract可能かの判定のみです。
   * 物理的な振る舞いや当たり判定は変更されません。
   *
   * `setVisiblePlayers`と`clearVisiblePlayers`はアイテムに含まれるRendererのenabledを変更します。
   * そのため、CreatorKitからアップロードしたワールドのアイテムに対してAnimator等を利用してRendererのenabledを変更する場合、この機能と合わせて使うと正常に動作しない可能性があります。
   *
   * この設定を取り消すには{@link ClusterScript.clearVisiblePlayers | ClusterScript.clearVisiblePlayers}を利用してください。
   *
   * 引数のplayersがnullの場合は例外になります。
   * 引数で渡せるplayersの配列の要素数は最大で64個までです。
   *
   * @param players アイテムを見れるようにするプレイヤーのリスト
   */
  setVisiblePlayers(players: PlayerHandle[]): void;

  /**
   * @beta
   *
   * このアイテムを見ることができるプレイヤーの設定をクリアします。
   *
   * クリアされた場合、Itemは全員に見える状況になります。
   */
  clearVisiblePlayers(): void;

  /**
   * このオブジェクトにアタッチされたUnityコンポーネントのハンドルを、型名を指定して取得します。
   * `type`として指定できるコンポーネント名については {@link UnityComponent} の説明を参照してください。
   * 
   * 同じコンポーネントが複数アタッチされている場合、最初に見つかったコンポーネントのハンドルを返します。
   * 
   * このAPIはCreatorKitからアップロードしたワールドでのみ利用可能です。
   * クラフトアイテムからはこのAPIは利用できません。
   * 
   * @param type 
   * @returns 指定したコンポーネントが存在すればそのコンポーネントのハンドル、なければ`null`
   */
  getUnityComponent(type: string) : UnityComponent | null;

  /**
   * このアイテムが置かれた空間がイベントかどうかを返します。
   *
   * @returns イベントの場合は`true`、そうでなければ`false`
   */
  isEvent(): boolean;

  /**
   * 乗ることができるアイテムに乗っているプレイヤーの移動入力に対して呼ばれるcallbackを登録します。
   * アイテムには `RidableItem` コンポーネントが付いている必要があります。
   * また、アイテムに`SteerItemTrigger`コンポーネントが付いている場合、`SteerItemTrigger`コンポーネントの実行が優先され、このcallbackは呼ばれません。
   * 
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   * 
   * `callback` の `input` はユーザーがスティックやキーボードで入力した移動入力の値です。
   * `input` のベクトルの大きさは0以上1以下です。
   * 
   * 左右の入力は `x` として表され、右方向が正です。
   * 前後の入力は `y` として表され、前方向が正です。
   * 
   * @param callback 
   * 
   * input = 移動入力のベクトルです。
   * 
   * player = アイテムを操作しているプレイヤーのハンドルです。
   * 
   */
  onSteer(callback: (input: Vector2, player: PlayerHandle) => void): void;

  /**
   * 乗ることができるアイテムに乗っているプレイヤーが追加入力を行ったときに呼ばれるcallbackを登録します。
   * アイテムには `RidableItem` コンポーネントが付いている必要があります。
   * また、アイテムに`SteerItemTrigger`コンポーネントが付いている場合、`SteerItemTrigger`コンポーネントの実行が優先され、このcallbackは呼ばれません。
   * 
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   * 
   * 追加入力を行う方法はプレイヤーの端末環境によって異なります。
   * いずれの方法でも、入力値は-1以上1以下の値を取ります。
   * 
   * - モバイル環境では、画面右下に表示される上下ボタンで入力します。
   * - デスクトップ環境では、スペースキー・左シフトキーでそれぞれ上下の入力を行います。
   * - VR環境では、右手コントローラーで上下の入力を行います。
   * 
   * @param callback 
   * 
   * input = 追加入力の値です。
   * 
   * player = アイテムを操作しているプレイヤーのハンドルです。
   * 
   */
  onSteerAdditionalAxis(callback: (input: number, player: PlayerHandle) => void): void;

  /** 
   * イベント会場において、イベントに参加中のいずれかのプレイヤーがギフトを贈ったときに呼ばれるコールバックを登録します。
   * 
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   * 
   * イベント以外の空間でもコールバック登録は成功しますが、イベント以外の空間では、後述するテスト用の機能を使った場合を除いてコールバックは呼ばれません。
   * 
   * このコールバックは実際にギフトが贈られた順序とは異なる順序で呼ばれることがあります。
   * また、2つ以上のギフトに対して一括でコールバックが呼ばれることがあります。
   * 
   * このコールバック機能は、スペースまたはワールドクラフト内でクラスターコインを使用せずにテストできます。
   * 詳細は [スラッシュコマンド](https://docs.cluster.mu/creatorkit/world/testing/slash-command/) で、ギフトに関する項目を参照してください。
   * 
   * @example 
   * ```ts
   * // イベントで贈られたギフトについて、そのギフトを送信したプレイヤーの表示名を取得する
   * $.onGiftSent((gifts) => {
   *   let names = gifts.map(g => g.senderDisplayName);
   * });
   * ```
   * 
   * @param callback
   * 
   * gifts: 贈られたギフトの情報です。
   * 
   */
  onGiftSent(callback: (gifts: GiftInfo[]) => void): void;

  /**
   * 直近に行われたコメントをcountで指定した件数だけ取得します。
   *
   * countは最大100までの自然数でコメントの最大取得件数を指定できます。
   * 場合によっては過去のコメントが十分に取得できないことがあります。
   * その場合、配列にはcount未満の個数のコメントが含まれます。
   *
   * countが0より小さい場合や100より大きい場合は0~100の範囲に丸められます。
   *
   * コメントはおおよそ時刻の早い方から順に並んでいますが、順序が安定していることは保証されません。
   * 発言時刻が近いコメントは取得のたびに順序が入れ替わる可能性があります。
   *
   * このAPIはイベント及びテスト用スペースのみで利用可能です。
   * イベント及びテスト用スペース以外でこのAPIを利用すると空の配列を返します。
   */
  getLatestComments(count: number): Comment[];

  /**
   * コメントが送信されたときに呼ばれるコールバックを登録します。
   *
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   *
   * タイミングの問題で同一のコメントに対して重複してコールバックが呼ばれたり、コールバックが呼ばれない可能性があります。
   *
   * また、2つ以上のコメントに対して一括でコールバックが呼ばれることがあります。
   *
   * このAPIはイベント及びテスト用スペースのみで利用可能です。
   * イベント及びテスト用スペース以外ではこのAPIによるコールバック登録は成功しますが、コールバックは呼ばれません。
   */
  onCommentReceived(callback: (comments: Comment[]) => void): void;

  /**
   * {@link PlayerHandle.requestGrantProduct | PlayerHandle.requestGrantProduct}で実施した商品付与の結果を取得した際に呼ばれるコールバックを登録します。
   *
   * スクリプトのトップレベルでの呼び出しのみサポートされます。
   * トップレベルで複数回呼ばれた場合、最後の登録のみが有効です。
   *
   * #### ルーム種別による挙動の違い:
   *
   * テスト用のスペースで呼び出された際、callback引数 {@link ProductGrantResult.status | result.status} は付与対象のプレイヤーが商品の販売者であることやプレイヤーの商品の所持状況に関わらず `"Granted"` を示しますが、実際には商品付与は実施されません。
   *
   * @param callback result = 商品付与の結果を示します。
   */
  onRequestGrantProductResult(callback: (result: ProductGrantResult) => void): void;
}

/** @internal @item */
// type StateProxy = {
//   [propName: string]: Sendable;
// };

/** @internal @item */
type CompatGimmickTarget = "this" | "owner" | "global";

/** @internal @item */
type CompatStateTarget = "this" | "owner";

/** @internal @item */
type CompatParamType = "signal" | "boolean" | "float" | "double" | "integer" | "vector2" | "vector3";

/** @internal @item */
type CompatSendable = boolean | number | Vector2 | Vector3;

/**
 * {@link ClusterScript.state | ClusterScript.state}に保存・{@link ItemHandle.send | ItemHandle.send}で送信可能な型です。
 * 
 * 具体的には、以下の値が{@link Sendable}です。
 * 
 * - `null`
 * - 数値
 * - 文字列
 * - boolean
 * - {@link Vector2}
 * - {@link Vector3}
 * - {@link Quaternion}
 * - {@link PlayerHandle}
 * - {@link ItemHandle}
 * - {@link Sendable}の配列
 * - 文字列をキーとして、{@link Sendable}を値に持つobject
 *
 * 特に、Sendableは `undefined` を含みません。
 * 
 * #### Sendableではない値からSendableへの変換
 *
 * `undefined`などのSendableではない値をSendableを要求するAPIに渡した場合、以下のルールに基づいて取り扱われます。
 * 
 * - `undefined`などのSendableではない値を直接渡した場合、APIに応じて例外になるか無視されます。
 * - `undefined`などのSendableではない値を含む配列を渡した場合、Sendableではない値を`null`に変換することでSendableとして扱われます。
 * - `undefined`などのSendableではない値を値として含むobjectを渡した場合、対応するkey-valueを削除することでSendableとして扱われます。
 *
 * これらの挙動が発生した場合、スクリプトコンソールに警告メッセージが表示されます。
 * また、これらの挙動は将来的なアップデートで例外になるように変更される予定です。
 *
 * #### SendableからPlayerScriptSendableへの変換
 *
 * {@link Sendable}をPlayerScriptに送信した場合、{@link PlayerScriptSendable}として扱えない値は以下のルールに基づいて{@link PlayerScriptSendable}に変換されます。
 * 
 * - {@link PlayerHandle} は同じプレイヤーを指し示す {@link PlayerId} になります。
 * - {@link ItemHandle} は同じアイテムを指し示す {@link ItemId} になります。
 * - 配列とobjectの中身もそれに応じて変換されます。
 * 
 * @example
 * ```ts
 * $.state.exampleKey1 = 1; // numberを書き込む
 * $.state.exampleKey2 = "hello"; // stringを書き込む
 * $.state.exampleKey3 = true; // booleanを書き込む
 * $.state.exampleKey4 = { foo: "bar" }; // objectを書き込む
 * $.state.exampleKey5 = [1, 2, 3]; // arrayを書き込む
 * $.state.exampleKey6 = { // 複雑なオブジェクトを書き込む
 *   array: [1, 2, 3],
 *   object: { foo: "bar" },
 * };
 * ```
 * 
 * @example
 * ```ts
 * itemHandle.send("message1", 10); // numberを送信する
 * itemHandle.send("message2", "hello"); // stringを送信する
 * itemHandle.send("message3", true); // booleanを送信する
 * itemHandle.send("message4", { foo: "bar" }); // objectを送信する
 * itemHandle.send("message5", [1, 2, 3]); // arrayを送信する
 * itemHandle.send("message6", { // 複雑なオブジェクトを送信する
 *   array: [1, 2, 3],
 *   object: { foo: "bar" },
 * });
 * ```
 * @item
 */
type Sendable = ExtJSON<SendablePrims>;

/**
 * {@link Sendable}で通常のJSONに加えて送信可能な型です。
 * @item
 */
type SendablePrims = Vector2 | Vector3 | Quaternion | PlayerHandle | ItemHandle;

/**
 * {@link PlayerScript.sendTo | PlayerScript.sendTo}で送信可能な型です。
 *
 * 具体的には、以下の値が{@link PlayerScriptSendable}です。
 * 
 * - `null`
 * - 数値
 * - 文字列
 * - boolean
 * - {@link Vector2}
 * - {@link Vector3}
 * - {@link Quaternion}
 * - {@link PlayerId}
 * - {@link ItemId}
 * - {@link PlayerScriptSendable}の配列
 * - 文字列をキーとして、{@link PlayerScriptSendable}を値に持つobject
 *
 * 特に、PlayerScriptSendableは `undefined` を含みません。
 * 
 * #### PlayerScriptSendableではない値からPlayerScriptSendableへの変換
 * 
 * `undefined`などのPlayerScriptSendableではない値をPlayerScriptSendableを要求するAPIに渡した場合、以下のルールに基づいて取り扱われます。
 *
 * - `undefined`などのPlayerScriptSendableではない値を直接渡した場合、APIに応じて例外になるか無視されます。
 * - `undefined`などのPlayerScriptSendableではない値を含む配列を渡した場合、PlayerScriptSendableではない値を`null`に変換することでPlayerScriptSendableとして扱われます。
 * - `undefined`などのPlayerScriptSendableではない値を値として含むobjectを渡した場合、対応するkey-valueを削除することでPlayerScriptSendableとして扱われます。
 * 
 * これらの挙動が発生した場合、スクリプトコンソールに警告メッセージが表示されます。
 * また、これらの挙動は将来的なアップデートで例外になるように変更される予定です。
 *
 * #### PlayerScriptSendableからSendableへの変換
 *
 * {@link PlayerScriptSendable}をItemScriptに送信した場合、{@link Sendable}として扱えない値は以下のルールに基づいて{@link Sendable}に変換されます。
 *
 * - {@link PlayerId} は同じプレイヤーを指し示す {@link PlayerHandle} になります。
 * - {@link ItemId} は同じアイテムを指し示す {@link ItemHandle} になります。
 * - 配列とobjectの中身もそれに応じて変換されます。
 *
 * @example
 * ```ts
 * _.sendTo(_.sourceItemId, "message1", 10); // numberを送信する
 * _.sendTo(_.sourceItemId, "message2", "hello"); // stringを送信する
 * _.sendTo(_.sourceItemId, "message3", true); // booleanを送信する
 * _.sendTo(_.sourceItemId, "message4", { foo: "bar" }); // objectを送信する
 * _.sendTo(_.sourceItemId, "message5", [1, 2, 3]); // arrayを送信する
 * _.sendTo(_.sourceItemId, "message6", { // 複雑なオブジェクトを送信する
 *   array: [1, 2, 3],
 *   object: { foo: "bar" },
 * });
 * ```
 * @player
 */
type PlayerScriptSendable = ExtJSON<PlayerScriptSendablePrims>;

/**
 * {@link PlayerScriptSendable}で通常のJSONに加えて送信可能な型です。
 * @player
 */
type PlayerScriptSendablePrims = Vector2 | Vector3 | Quaternion | PlayerId | ItemId;

/**
 * JSONとして表現可能なデータ構造のプリミティブに`T`を加えた型です。
 * 
 * 通常のJSONとは異なり、数値として `Infinity`, `-Infinity`, `NaN` を取り扱うことができます。
 */
type ExtJSON<T> = { [key: string]: ExtJSON<T> } | ExtJSON<T>[] | number | string | boolean | null | T;

/**
 * ヒューマノイドモデルの姿勢情報を反映するために使用するオプション値です。
 * objectで指定することができ、特定のプロパティ名を指定することで対象のアバターに対してどのように姿勢を設定するか、を操作することができます。
 * @item
 */
type SetHumanoidPoseOption = {
 /**
  * HumanoidPoseで姿勢の上書きを反映するのにかける時間(秒)の設定値です。
  * 上書きする姿勢への遷移中は、アバターの現在の姿勢と上書きする姿勢を時間によって線形補完した姿勢を設定します。
  *
  * 0以上の値を設定できます。
  * 0より小さい値やNaNを設定した場合、0が設定されます。
  * 未設定の場合、0として扱われます。
  */
 transitionSeconds: number;
 /**
  * 設定されたHumanoidPoseを解除するのにかける時間(秒)の設定値です。
  * 姿勢の設定後、指定された秒数が経過したときに`setHumanoidPose`による姿勢の上書きを解除することができます。
  *
  * `transitionSeconds` 以上の値を設定できます。
  * `transitionSeconds` より小さい値を設定した場合、`transitionSeconds` に設定されている値が設定されます。
  * NaNを設定した場合、Infinityが設定されます。
  * 未設定の場合、Infinityとして扱われます。
  * Infinityが設定されている場合には時間経過での姿勢の解除は行われません。
  */
 timeoutSeconds: number;
 /**
  * `timeoutSeconds`で姿勢の上書きが解除される際、元の姿勢に戻るためにかける時間(秒)の設定値です。
  * 元の姿勢への遷移中は、上書きされた姿勢と元の姿勢を時間によって線形補完した姿勢が反映されます。
  * 
  * 0以上の値を設定できます。
  * 0より小さい値やNaNを設定した場合、0が設定されます。
  * 未設定の場合、0として扱われます。
  */
 timeoutTransitionSeconds: number
}

/**
 * @item @beta
 * {@link ClusterScript.createItem | ClusterScript.createItem}で使用するオプション値です。
 */
type CreateItemOption = {
  /**
   * アイテムグループのメンバーアイテムとして生成します。
   * 
   * 呼び出し元のアイテムがホストアイテムでない場合、{@link ClusterScriptError}が発生します。
   * 指定したワールドアイテムテンプレートに[Item Group Host](https://docs.cluster.mu/creatorkit/item-components/item-group-host/) コンポーネントがついている場合は、`asMember`の値に関わらずホストアイテムとして生成されます。
   * 
   * アイテムグループの詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/world/item/item-group/)を参照してください。
   */
  asMember: boolean;
}

/**
 * 自身のアイテムの子要素のオブジェクトを操作するハンドルです。
 * @item
 */
interface SubNode {
  /**
   * SubNodeのオブジェクトの名前です。
   * {@link ClusterScript.subNode | ClusterScript.subNode}で指定する`subNodeName`と同じものです。
   * @example
   * ```ts
   * let subNode = $.subNode("MySubNode");
   * $.log(subNode.name); // => MySubNode
   * ```
   */
  readonly name: string;

  /**
   * SubNodeの移動させたい位置を指定します。
   * 位置はネットワークを介して補間して同期されるため、即座に反映されない場合があることに留意してください。
   * 
   * @param pos 移動先の位置 (アイテムのローカル座標)
   */
  setPosition(pos: Vector3): void;

  /**
   * SubNodeの現在の位置を取得します。
   * setPositionで指定された値ではなく、移動中のSubNodeの位置が返されることに留意してください。
   *
   * 値の取得に失敗した場合、undefinedを返します。
   *
   * @returns 現在の位置 (アイテムのローカル座標)
   */
  getPosition(): Vector3 | undefined;

  /**
   * SubNodeの回転させたい姿勢を指定します。
   * 姿勢はネットワークを介して補間して同期されるため、即座に反映されない場合があることに留意してください。
   * 
   * @param rot 回転 (アイテムのローカル座標)
   */
  setRotation(rot: Quaternion): void;

  /**
   * SubNodeの現在の姿勢を取得します。
   * setRotationで指定された値ではなく、移動中のSubNodeの姿勢が返されることに留意してください。
   *
   * 値の取得に失敗した場合、undefinedを返します。
   *
   * @returns 現在の姿勢 (アイテムのローカル座標)
   */
  getRotation(): Quaternion | undefined;

  /**
   * 現在の位置を取得します。
   * setPositionで指定された値ではなく、移動中のSubNodeの位置が返されることに留意してください。
   *
   * 値の取得に失敗した場合、nullを返します。
   *
   * @returns 現在の位置 (グローバル座標)
   */
  getGlobalPosition(): Vector3 | null;

  /**
   * 現在の姿勢を取得します。
   * setRotationで指定された値ではなく、移動中のSubNodeの姿勢が返されることに留意してください。
   *
   * 値の取得に失敗した場合、nullを返します。
   *
   * @returns 現在の姿勢 (グローバル座標)
   */
  getGlobalRotation(): Quaternion | null;

  /**
   * SubNodeの有効状態を変更します。
   * 有効でないSubNodeとその全ての子のSubNodeは空間上で有効でなくなり、描画されず、当たり判定が無いものとして扱われます。
   * 
   * 有効状態はネットワークを介して同期されるため、即座に反映されない場合があることに留意してください。
   * 
   * @param v 有効ならtrue
   */
  setEnabled(v: boolean): void;

  /**
   * SubNodeの現在の有効状態を取得します。
   * 
   * setEnabledで指定された値ではなく、SubNodeの現在の有効状態が返されることに留意してください。
   *
   * 値の取得に失敗した場合、undefinedを返します。
   *
   */
  getEnabled(): boolean | undefined;

  /**
   * SubNodeが空間上で有効かを取得します。
   * そのSubNodeと全ての親が有効である時にそのSubNodeは空間上で有効になります。
   * 
   * setEnabledで指定された値ではなく、SubNodeの現在の有効状態が返されることに留意してください。
   *
   * 値の取得に失敗した場合、undefinedを返します。
   *
   */
  getTotalEnabled(): boolean | undefined;

  /**
   * SubNodeが描画する文字列を指定します。
   * `\n`を使用することで改行することが可能です。
   * 文字列のサイズは1kB以下である必要があります。
   * 1kBを超えている場合は{@link ClusterScriptError} (`requestSizeLimitExceeded`) が発生し、失敗します。
   * SubNodeにTextViewがついていない場合、何も起きません。
   * 
   * TextViewの詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/world-components/text-view/)を参照してください。
   * 
   * @param text
   */
  setText(text: string): void;

  /**
   * SubNodeが描画する文字列の大きさを指定します。
   * sizeは0以上5以下の値が指定できます。範囲外の値を指定した場合は自動的に丸められます。
   * 描画される文字列の大きさはsizeとSubNodeのグローバルスケールの両方に比例します。
   * SubNodeのグローバルスケールが1のとき、sizeに1を指定すると文字の高さ（エックスハイト）はほぼ1mになります。
   * SubNodeにTextViewがついていない場合、何も起きません。
   * 
   * TextViewの詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/world-components/text-view/)を参照してください。
   * 
   * @param size
   */
  setTextSize(size: number): void;

  /**
   * SubNodeが描画する文字列が改行を含んでいる際の水平方向の配置を指定します。
   * SubNodeにTextViewがついていない場合、何も起きません。
   * 
   * TextViewの詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/world-components/text-view/)を参照してください。
   * 
   * @example
   * ```ts
   * subNode.setTextAlignment(TextAlignment.Left);
   * ```
   * @param alignment
   */
  setTextAlignment(alignment: TextAlignment): void;

  /**
   * SubNodeが描画する文字列のアンカーを指定します。
   * 例えば、UpperLeftを指定した場合、文字列の左上の角がSubNodeの位置に一致するようになります。
   * SubNodeにTextViewがついていない場合、何も起きません。
   * 
   * TextViewの詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/world-components/text-view/)を参照してください。
   * 
   * @example
   * ```ts
   * subNode.setTextAnchor(TextAnchor.UpperLeft);
   * ```
   * @param alignment
   */
  setTextAnchor(anchor: TextAnchor): void;

  /**
   * SubNodeが描画する文字列の色をRGBA値で指定します。
   * RGBA値はそれぞれ0以上1以下で、色空間はsRGB（ガンマ）です。範囲外の値を指定した場合は自動的に丸められます。
   * SubNodeにTextViewがついていない場合、何も起きません。
   * 
   * TextViewの詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/world-components/text-view/)を参照してください。
   * 
   * @param r R値
   * @param g G値
   * @param b B値
   * @param a アルファ値（0のとき透明になります）
   */
  setTextColor(r: number, g: number, b: number, a: number): void;

  /**
   * このオブジェクトにアタッチされたUnityコンポーネントのハンドルを、型名を指定して取得します。
   * `type`として指定できるコンポーネント名については {@link UnityComponent} の説明を参照してください。
   * 
   * 同じコンポーネントが複数アタッチされている場合、最初に見つかったコンポーネントのハンドルを返します。
   * 
   * このAPIはCreatorKitからアップロードしたワールドでのみ利用可能です。
   * クラフトアイテムからはこのAPIは利用できません。
   * 
   * @param type 
   * @returns 指定したコンポーネントが存在すればそのコンポーネントのハンドル、なければ`null`
   */
  getUnityComponent(type: string) : UnityComponent | null;
}

/**
 * 文字列のアンカーを表します。
 * @item
 */
declare enum TextAnchor {
  UpperLeft,
  UpperCenter,
  UpperRight,
  MiddleLeft,
  MiddleCenter,
  MiddleRight,
  LowerLeft,
  LowerCenter,
  LowerRight,
}

/**
 * 改行を含む文字列の水平方向の揃え方（左揃え、中央揃え、右揃え）を表します。
 * @item
 */
declare enum TextAlignment {
  Left,
  Center,
  Right,
}

/**
 * Raycastの結果を表す、readonlyな型です。
 * @item
 */
interface RaycastResult {
  /**
   * 当たりの情報を表します。
   */
  readonly hit: Hit;

  /**
   * 当たった対象のハンドルまたは `null` を返します。
   *
   * 当たった対象がアイテムである場合、 {@link ItemHandle} を返します。  
   * 当たった対象がプレイヤーである場合、 {@link PlayerHandle} を返します。  
   * 当たった対象がアイテムでもプレイヤーでもない場合、 `null` を返します。
   * 
   * この値の取り扱い方はScript Referenceトップページの [ハンドル](/script/#%E3%83%8F%E3%83%B3%E3%83%89%E3%83%AB) も参照してください。
   */
  readonly handle: ItemHandle | PlayerHandle | null;
}

/**
 * Raycastの当たった地点の情報を表す、readonlyな型です。
 */
interface Hit {
  /**
   * 当たった点の位置(グローバル座標)を表します。
   */
  readonly point: Vector3;

  /**
   * 当たった面の法線(グローバル座標)を表します。
   */
  readonly normal: Vector3;
}

/**
 * アイテムと他の物体の衝突イベントを表します。
 * @item
 */
interface Collision {
  /**
   * 衝突先の物体を表すハンドルまたは `null` を返します。
   *
   * 衝突先の物体がアイテムである場合、 {@link ItemHandle} を返します。  
   * 衝突先の物体がプレイヤーである場合、 {@link PlayerHandle} を返します。  
   * 衝突先の物体がアイテムでもプレイヤーでもない場合、 `null` を返します。
   * 
   * この値の取り扱い方はScript Referenceトップページの [ハンドル](/script/#%E3%83%8F%E3%83%B3%E3%83%89%E3%83%AB) も参照してください。
   */
  readonly handle: ItemHandle | PlayerHandle | null;

  /**
   * 衝突点の情報を表します。
   * 物体が面や辺で接触している場合、複数の衝突点として表現されます。
   */
  readonly collidePoints: CollidePoint[];

  /**
   * 衝突によって発生する力積の合計値です。
   */
  readonly impulse: Vector3;

  /**
   * 衝突した物体のアイテムから見た相対速度です。
   */
  readonly relativeVelocity: Vector3;
}

/**
 * アイテムと他の物体が衝突している点の一つを表します。
 * @item
 */
interface CollidePoint {
  /**
   * 衝突元のアイテムで、どの部分が衝突しているかを表します。
   */
  readonly selfNode: ClusterScript | SubNode;

  /**
   * 衝突先の物体の点を表します。
   */
  readonly hit: Hit;
}

/**
 * アイテムと他の物体の重なりを表します。
 * @item
 */
interface Overlap {
  /**
   * 重なっている物体を表すハンドルまたは `null` を返します。
   * 
   * 重なっている物体がアイテムである場合、 {@link ItemHandle} を返します。  
   * 重なっている物体がプレイヤーである場合、 {@link PlayerHandle} を返します。  
   * 重なっている物体がアイテムでもプレイヤーでもない場合、 `null` を返します。
   * 
   * この値の取り扱い方はScript Referenceトップページの [ハンドル](/script/#%E3%83%8F%E3%83%B3%E3%83%89%E3%83%AB) も参照してください。
   */
  readonly handle: ItemHandle | PlayerHandle | null;

  /**
   * アイテムのどの部分が重なっているかを表します。
   */
  readonly selfNode: ClusterScript | SubNode;
}

/**
 * ヒューマノイドモデルのアニメーション情報を表します。
 * HumanoidAnimationListコンポーネントにAnimationClipを登録することで、アイテムにアニメーション情報を追加できます。
 * {@link ClusterScript.humanoidAnimation | ClusterScript.humanoidAnimation}で取得することができます。
 *
 * HumanoidAnimationListの詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/item-components/humanoid-animation-list/)を参照してください。
 */
interface HumanoidAnimation {

  /**
   * 指定した再生位置におけるヒューマノイドモデルの姿勢情報を取得します。
   * 再生位置は、0がアニメーションの先頭、getLength()の値がアニメーションの末尾を表します。
   *
   * ループアニメーションであるアニメーションについて、アニメーションの末尾以降の再生位置を指定した場合はループを考慮した姿勢情報を返します。
   * それ以外の場合、指定された再生位置はアニメーションの先頭から末尾までの範囲内の値に丸められます。
   *
   * アニメーションが存在しない場合、空のHumanoidPoseを返します。
   * @param time アニメーションの再生位置（秒数）
   */
  getSample(time: number): HumanoidPose;

  /**
   * アニメーションの再生時間を秒数で返します。
   *
   * アニメーションが存在しない場合、0を返します。
   */
  getLength(): number;

  /**
   * アニメーションがループアニメーションである場合はtrueを返します。
   */
  getIsLoop(): boolean;
}

/**
 * ヒューマノイドモデルの姿勢情報を表します。
 * アバターのルートとはおおまかにアバターの足元の位置を表します。
 */
declare class HumanoidPose {
  /**
   * HumanoidPoseを生成します。
   */
  constructor(centerPosition: Vector3 | null, centerRotation: Quaternion | null, muscles: Muscles | null);

  /**
   * アバターの重心の位置をアバターのルートを原点とする正規化された相対座標で示したものです。
   * スケールがアバターの大きさによって正規化されているため、グローバル座標での位置変化を指定するためには非推奨です。
   * (代わりに、{@link PlayerHandle.setPosition | PlayerHandle.setPosition}が利用可能です)。
   */
  centerPosition: Vector3 | null;

  /**
   * アバターの重心の回転をアバターのルートからの相対回転で示したものです。
   */
  centerRotation: Quaternion | null;

  muscles: Muscles | null;
}

/**
 * ヒューマノイドモデルの姿勢情報の、"muscle"値です。
 * 各muscle値は[-1,1]に正規化された「曲げ」の量を表します。
 */
declare class Muscles {
  /**
   * 全ての要素がundefinedなMusclesを生成します。
   * 値がundefinedなmuscleは指定されていないと見なされます。
   */
  constructor();
  spineFrontBack: number | undefined;
  spineLeftRight: number | undefined;
  spineTwistLeftRight: number | undefined;
  chestFrontBack: number | undefined;
  chestLeftRight: number | undefined;
  chestTwistLeftRight: number | undefined;
  upperChestFrontBack: number | undefined;
  upperChestLeftRight: number | undefined;
  upperChestTwistLeftRight: number | undefined;
  neckNodDownUp: number | undefined;
  neckTiltLeftRight: number | undefined;
  neckTurnLeftRight: number | undefined;
  headNodDownUp: number | undefined;
  headTiltLeftRight: number | undefined;
  headTurnLeftRight: number | undefined;
  leftEyeDownUp: number | undefined;
  leftEyeInOut: number | undefined;
  rightEyeDownUp: number | undefined;
  rightEyeInOut: number | undefined;
  jawClose: number | undefined;
  jawLeftRight: number | undefined;
  leftUpperLegFrontBack: number | undefined;
  leftUpperLegInOut: number | undefined;
  leftUpperLegTwistInOut: number | undefined;
  leftLowerLegStretch: number | undefined;
  leftLowerLegTwistInOut: number | undefined;
  leftFootUpDown: number | undefined;
  leftFootTwistInOut: number | undefined;
  leftToesUpDown: number | undefined;
  rightUpperLegFrontBack: number | undefined;
  rightUpperLegInOut: number | undefined;
  rightUpperLegTwistInOut: number | undefined;
  rightLowerLegStretch: number | undefined;
  rightLowerLegTwistInOut: number | undefined;
  rightFootUpDown: number | undefined;
  rightFootTwistInOut: number | undefined;
  rightToesUpDown: number | undefined;
  leftShoulderDownUp: number | undefined;
  leftShoulderFrontBack: number | undefined;
  leftArmDownUp: number | undefined;
  leftArmFrontBack: number | undefined;
  leftArmTwistInOut: number | undefined;
  leftForearmStretch: number | undefined;
  leftForearmTwistInOut: number | undefined;
  leftHandDownUp: number | undefined;
  leftHandInOut: number | undefined;
  rightShoulderDownUp: number | undefined;
  rightShoulderFrontBack: number | undefined;
  rightArmDownUp: number | undefined;
  rightArmFrontBack: number | undefined;
  rightArmTwistInOut: number | undefined;
  rightForearmStretch: number | undefined;
  rightForearmTwistInOut: number | undefined;
  rightHandDownUp: number | undefined;
  rightHandInOut: number | undefined;
  leftThumb1Stretched: number | undefined;
  leftThumbSpread: number | undefined;
  leftThumb2Stretched: number | undefined;
  leftThumb3Stretched: number | undefined;
  leftIndex1Stretched: number | undefined;
  leftIndexSpread: number | undefined;
  leftIndex2Stretched: number | undefined;
  leftIndex3Stretched: number | undefined;
  leftMiddle1Stretched: number | undefined;
  leftMiddleSpread: number | undefined;
  leftMiddle2Stretched: number | undefined;
  leftMiddle3Stretched: number | undefined;
  leftRing1Stretched: number | undefined;
  leftRingSpread: number | undefined;
  leftRing2Stretched: number | undefined;
  leftRing3Stretched: number | undefined;
  leftLittle1Stretched: number | undefined;
  leftLittleSpread: number | undefined;
  leftLittle2Stretched: number | undefined;
  leftLittle3Stretched: number | undefined;
  rightThumb1Stretched: number | undefined;
  rightThumbSpread: number | undefined;
  rightThumb2Stretched: number | undefined;
  rightThumb3Stretched: number | undefined;
  rightIndex1Stretched: number | undefined;
  rightIndexSpread: number | undefined;
  rightIndex2Stretched: number | undefined;
  rightIndex3Stretched: number | undefined;
  rightMiddle1Stretched: number | undefined;
  rightMiddleSpread: number | undefined;
  rightMiddle2Stretched: number | undefined;
  rightMiddle3Stretched: number | undefined;
  rightRing1Stretched: number | undefined;
  rightRingSpread: number | undefined;
  rightRing2Stretched: number | undefined;
  rightRing3Stretched: number | undefined;
  rightLittle1Stretched: number | undefined;
  rightLittleSpread: number | undefined;
  rightLittle2Stretched: number | undefined;
  rightLittle3Stretched: number | undefined;

}

/**
 * クラフトアイテムの元となる、アイテムテンプレートのIDを表します。
 * {@link ClusterScript.createItem | ClusterScript.createItem} に渡すことで、クラフトアイテムを生成できます。
 * @item
 */
declare class ItemTemplateId {
  /**
   * clusterにアップロードされたクラフトアイテムのテンプレートのIDを表すインスタンスを生成します。
   * 
   * クラフトアイテムのテンプレートのIDはCreator Kitの「クラフトアイテムの情報取得」機能から取得することが出来ます。
   * 「クラフトアイテムの情報取得」ウィンドウに表示される、 `ItemTemplateId =` 以降の文字列がそのアイテムのテンプレートのIDです。
   * 詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/craft-item/upload/get-craft-item-informations/)を参照してください。
   * 
   * @example
   * ```ts
   * let itemTemplateId = new ItemTemplateId("12345678-abcd-1234-abcd-123456789abc");
   * ```
   * 
   * @param id UUID形式の文字列
   */
  constructor(id: string);
}

/**
 * [World Item Template List](https://docs.cluster.mu/creatorkit/item-components/world-item-template-list/)で登録した[ワールドアイテムテンプレート](https://docs.cluster.mu/creatorkit/item/about-item/#ワールドアイテムテンプレート)を参照するためのIDを表します。
 * {@link ClusterScript.createItem | ClusterScript.createItem} に渡すことで、ワールドアイテムテンプレートからワールドアイテムを生成できます。
 *
 * @example
 * ```ts
 * const position = $.getPosition();
 * position.y += 1.0;
 * const rotation = $.getRotation();
 *
 * const worldItemTemplateId = new WorldItemTemplateId("marker");
 * $.createItem(worldItemTemplateId, position, rotation);
 * ```
 * @item
 */
declare class WorldItemTemplateId {
  /**
   * ワールドアイテムテンプレートを参照するためのIDを表すインスタンスを生成します。
   *
   * @param id WorldItemTemplateListで設定したId
   */
  constructor(id: string);
}


/**
 * 外部通信機能の送信先エンドポイントを指定するIDを表します。
 * {@link ClusterScript.callExternal:0 | ClusterScript.callExternal(ExternalEndpointId, string, string)} に渡すことで、リクエスト送信先となる外部サーバーを指定できます。
 *
 * @item
 */
declare class ExternalEndpointId {
  /**
   * 外部通信機能の送信先エンドポイントのIDを表すインスタンスを生成します。
   *
   * @param id Creator Kitの外部通信(callExternal)接続先URLウィンドウに表示されるEndpoint ID
   */
  constructor(id: string);
}


/**
 * @item
 * イベントにおけるプレイヤーのロールの種類を表します。
 */
declare enum EventRole {
  Staff = 1,
  Guest = 2,
  Audience = 3,
}

/**
 * アイテムを外部から操作するためのハンドルです。
 * ハンドルは自分自身を指していることも、それ以外を指していることも、指している先が存在しないこともあります。
 * @item
 */
declare class ItemHandle {
  /** @internal */
  private constructor();

  /**
   * 空間内のアイテムを一意に表すIDの文字列表現です。
   * idが等しいItemHandleは同一のアイテムを指し示します。
   */
  readonly id: string;

  /**
   * 文字列 "item" を返します。
   * この値は {@link ItemHandle} と {@link PlayerHandle} を区別するために利用できます。
   */
  readonly type: "item";

  /**
   * @beta
   * アイテムが存在する場合、trueを返します。
   * ロード中でもtrueを返すことがあります。
   */
  exists(): boolean;

  /**
   * アイテムにメッセージを送ります。
   * 送られた対象は{@link ClusterScript.onReceive | ClusterScript.onReceive}に設定したコールバックを呼ぶことが期待されます。
   * 
   * 削除されたアイテムに対してや、無効なitemHandleに対しては無視されます。
   * 
   * メッセージのペイロード（`arg`引数）に使用できるデータについては{@link Sendable}を参照してください。
   *
   * `undefined` など、Sendableではない値をペイロードとして`arg`引数に渡した場合、無視されます。
   * この挙動は将来的に変更される可能性があります。
   *
   * @example
   * 以下は{@link ClusterScript.onReceive | ClusterScript.onReceive}の例に対応するメッセージの例です。
   * ```ts
   * itemHandle.send("damage", 20);
   * itemHandle.send("heal", 10);
   * ```
   *
   * 以下の例では、アイテムを使用したプレイヤーのハンドルを"chase"というメッセージタイプで周囲2m以内のアイテムに対して送信します。
   * ```ts
   * $.onUse((isDown, player) => {
   *   if (!isDown) return;
   *   let items = $.getItemsNear($.getPosition(), 2);
   *   for (let item of items) {
   *     item.send("chase", player);
   *   }
   * });
   * ```
   *
   * 受け取ったメッセージをどう処理するかは、受け取る側のアイテムの{@link ClusterScript.onReceive | ClusterScript.onReceive}に記述します。
   * 以下の例では、アイテムはプレイヤーを5秒間追いかけます。
   * ```ts
   * $.onReceive((messageType, arg, sender) => {
   *   switch (messageType) {
   *     case "chase":
   *       $.state.target = arg;
   *       $.state.time = 0;
   *       break;
   *   }
   * });
   * 
   * $.onUpdate(deltaTime => {
   *   let target = $.state.target;
   *   if (!target) return;
   * 
   *   let time = $.state.time ?? 0;
   *   time += deltaTime;
   *   $.state.time = time;
   * 
   *   if (time > 5) {
   *     $.state.target = null;
   *     return;
   *   }
   * 
   *   $.setPosition($.getPosition().lerp(target.getPosition(), 0.02));
   * });
   * ```
   * #### 頻度の制限:
   * 
   * sendを呼び出すことができる頻度には制限があります。
   * - このスクリプトを実行しているアイテムがクラフトアイテムであった場合、ひとつのアイテムあたり10回/秒以下
   * - このスクリプトを実行しているアイテムがワールドアイテムであった場合、スペース内の全てのワールドアイテムからの {@link ItemHandle.send}, {@link PlayerHandle.send}, {@link PlayerScript.sendTo} の呼び出し回数の合計が3000回/秒以下
   * 
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   * 
   * #### 流量制御による制限:
   * 
   * このスクリプトを実行しているアイテムがワールドアイテムである場合、sendが動作するためには、流量制御による遅延が30秒以下である必要があります。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * #### 容量の制限:
   *
   * エンコードされた`arg`のデータサイズは1000byte以下である必要があります。
   * データサイズが制限を超えている場合、警告が表示されます。
   * データサイズは{@link ClusterScript.computeSendableSize}で計算できます。
   *
   * データサイズが制限を大きく超えている場合、{@link ClusterScriptError} (`requestSizeLimitExceeded`) が発生しsendは失敗します。
   *
   * @param messageType メッセージの種別を表す100byte以下の任意の文字列
   * @param arg メッセージのペイロード
   */
  send(messageType: string, arg: Sendable): void;

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // 力系
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * アイテムの重心に撃力を加えます。アイテムが力の影響を受けない場合は撃力が無視されます。
   * 重心以外に撃力を加えたい場合は{@link ItemHandle.addImpulsiveForceAt}を使用してください。
   * 
   * #### 頻度の制限:
   * 
   * ひとつのアイテムは、最大で10回/秒まで他のハンドルに対して操作することができます。
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   * 
   * @param force 撃力 (グローバル座標)
   */
  addImpulsiveForce(force: Vector3): void;

  /**
   * アイテムの重心に角力積を加えます。アイテムが力の影響を受けない場合単に無視されます。
   * 
   * #### 頻度の制限:
   * 
   * ひとつのアイテムは、最大で10回/秒まで他のハンドルに対して操作することができます。
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   * 
   * @param torque 角力積 (グローバル座標)
   */
  addImpulsiveTorque(torque: Vector3): void;

  /**
   * アイテムの指定位置に撃力を加えます。アイテムが力の影響を受けない場合単に無視されます。
   * 力を加える先にアイテムの実体 (PhysicalShapeやメッシュ等)が存在する必要はありません。
   * 
   * #### 頻度の制限:
   * 
   * ひとつのアイテムは、最大で10回/秒まで他のハンドルに対して操作することができます。
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   * 
   * @param impulse 撃力 (グローバル座標)
   * @param position 位置 (グローバル座標)
   */
  addImpulsiveForceAt(impulse: Vector3, position: Vector3): void;
}

/**
 * プレイヤーを外部から操作するためのハンドルです。
 * プレイヤーのアバターを変更してもPlayerHandleは不変です。
 * ユーザーは入室ごとに別のプレイヤーとして取り扱われます。
 * このため、再入室したユーザーに対しては再度PlayerHandleを取得しなおす必要があります。
 *
 * イベントでは、ゴーストやグループビューイングの参加者はスクリプトから取得できません。
 * 詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/event/event-world/)を参照してください。
 * @item
 */
declare class PlayerHandle {
  /** @internal */
  private constructor();

  /**
 * 空間内のプレイヤーを一意に表すIDの文字列表現です。
 * idが等しいPlayerHandleは同一のプレイヤーを指し示します。
 * この値は同じユーザーでも入室ごとに異なります。
 */
  readonly id: string;

  /**
   * プレイヤーの[ユーザーID](https://help.cluster.mu/hc/ja/articles/115000821651-%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BCID)です。
   * ユーザーは自分のユーザーIDを変更することができますが、
   * 異なるユーザーが同じユーザーIDを同時にもつことはありません。
   * プレイヤーが存在しないとき、`null`を返します。プレイヤーの存在は{@link PlayerHandle.exists}で確認できます。
   */
  readonly userId: string | null;

  /**
   * プレイヤーの[表示名](https://help.cluster.mu/hc/ja/articles/115000827152-%E8%A1%A8%E7%A4%BA%E5%90%8D)です。
   * ユーザーは自分の表示名を変更することができ、異なるユーザーが同じ表示名を使うことができます。
   * プレイヤーが存在しないとき、`null`を返します。プレイヤーの存在は{@link PlayerHandle.exists}で確認できます。
   */
  readonly userDisplayName: string | null;

  /**
   * [IDFC](https://docs.cluster.mu/creatorkit/world/manage-data/#idfc-identifier-for-creator)の値を取得します。
   * IDFCはクリエイターがユーザーを一意に認識するために利用できる文字列です。
   * この文字列は32文字で、使われる文字は `0123456789abcdef` です。
   * この文字列はそのアイテム・ワールドをアップロードしたアカウントとユーザーのアカウントとの組によって決定されます。ユーザーの使用するデバイスやスペースによっては変化しません。
   * プレイヤーが存在しないとき、`null`を返します。プレイヤーの存在は{@link PlayerHandle.exists}で確認できます。
   *
   * この文字列はコンテンツ体験を向上する目的で利用できます。当社が不適切と判断した場合、予告なく利用を制限させていただく場合もあります。
   */
  readonly idfc: string | null;

  /**
   * 文字列 "player" を返します。
   * この値は {@link ItemHandle} と {@link PlayerHandle} を区別するために利用できます。
   */
  readonly type: "player";

  /**
   * プレイヤーが入室中なら`true`を返し、退室済みなら`false`を返します。
   * プレイヤーが通信の不具合などで一時的に非表示になっている場合も`true`を返します。
   *
   */
  exists(): boolean;

  /**
   * プレイヤーの位置を変更します。
   * 
   * #### 頻度の制限:
   * 
   * ひとつのアイテムは、最大で10回/秒まで他のハンドルに対して操作することができます。
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   * 
   * @param position 足元の中心位置の移動先 (グローバル座標)
   */
  setPosition(position: Vector3): void;

  /**
   * プレイヤーの向きを変更します。
   * 体の向きは鉛直のままで、y軸回転以外は動きません
   * 
   * #### 頻度の制限:
   * 
   * ひとつのアイテムは、最大で10回/秒まで他のハンドルに対して操作することができます。
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   * 
   * @param rotation プレイヤーの向き (グローバル座標)
   */
  setRotation(rotation: Quaternion): void;

  /**
   * プレイヤーのアバターモデルの姿勢を、指定したHumanoidPoseで上書きします。
   * 姿勢の上書き方法についてはoptionで指定することができます。optionで指定できるプロパティについては {@link SetHumanoidPoseOption} を参照してください。
   *
   * 引数のoptionは省略することができます。省略した場合にはデフォルトの設定値が用いられます。
   *
   * HumanoidPoseのrootPosition, rootRotation, muscleのうち、指定されていない要素については上書きされません。
   * また、指定されていない要素については`option.timeoutSeconds`、および `option.timeoutTransitionSeconds` は挙動に影響を与えず、上書きされない状態が継続します。
   * 姿勢の上書きは、次に`setHumanoidPose`が呼び出される、もしくはoptionで指定したtimeoutで姿勢が解除されるまで継続します。
   *
   * 引数にnullまたは空のHumanoidPoseを渡すことで、`setHumanoidPose`によるポーズの上書きを全て解除することができます。
   * 引数にnullまたは空のHumanoidPoseをoptionと一緒に渡した場合、`option.transitionSeconds` かけて解除された状態に遷移します。
   * 
   * `setHumanoidPose`によるポーズの上書きは、エモートや`RidableItem`による姿勢の変更よりも優先されます。
   *
   * VRではプレイヤーが掴んでいるアイテムは指定されたポーズに追従しますが、1人称のカメラやUI操作などは影響を受けません。
   *
   *
   * @example
   * ```ts
   * // MyAnimationというIdのHumanoidAnimationを取得する。
   * const animation = $.humanoidAnimation("MyAnimation");
   * // ポーズを上書きする。
   * playerHandle.setHumanoidPose(animation.getSample(0));
   * // 上書きを解除する。
   * playerHandle.setHumanoidPose(null);
   * ```
   *
   * ```ts
   * const animation = $.humanoidAnimation("MyAnimation");
   * const interval = 0.1;
   * const animationLength = animation.getLength();
   *
   * // Interactした人をアニメーションの対象にする
   * $.onInteract(player => {
   *     if ($.state.player) {
   *         // すでに対象がいるときは解除
   *         $.state.player.setHumanoidPose(null);
   *     }
   *     $.state.animationTime = 0;
   *     $.state.waitingTime = 0;
   *     $.state.player = player;
   * });
   *
   * $.onUpdate(deltaTime => {
   *     let player = $.state.player;
   *     if (!player || !player.exists()) return;
   *
   *     let animationTime = $.state.animationTime + deltaTime;
   *     if (animationTime > animationLength) {
   *         animationTime = animationTime % animationLength;
   *     }
   *     let waitingTime = $.state.waitingTime + deltaTime;
   *     if (waitingTime >= interval) {
   *         let pose = animation.getSample(animationTime);
   *         // 前回送信時からの時間分だけかけて姿勢を遷移させる
   *         player.setHumanoidPose(pose, {transitionSeconds: waitingTime});
   *         waitingTime = 0;
   *     }
   *     $.state.animationTime = animationTime;
   *     $.state.waitingTime = waitingTime;
   * });
   * ```
   *
   * #### 頻度の制限:
   * 
   * ひとつのアイテムは、最大で10回/秒まで他のハンドルに対して操作することができます。
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   */
  setHumanoidPose(pose: HumanoidPose, option: SetHumanoidPoseOption): void;

  /**
   * プレイヤーの位置（グローバル座標）を取得します。取得に失敗したときは`null`を返します。
   */
  getPosition(): Vector3 | null;

  /**
   * プレイヤーの向き（グローバル座標）を取得します。取得に失敗したときは`null`を返します。
   */
  getRotation(): Quaternion | null;

  /**
   * プレイヤーをリスポーンさせます。
   * 
   * #### 頻度の制限:
   * 
   * ひとつのアイテムは、最大で10回/秒まで他のハンドルに対して操作することができます。
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   */
  respawn(): void;

  /**
   * @beta プレイヤーに速度を加えます。
   * プレイヤーの最終的な移動速度は、加えられた速度とプレイヤー入力の両方から決定されます。
   * プレイヤーが地面に接している間、加えられた速度は摩擦と似たような原理で減速し続けます。
   * 
   * #### 頻度の制限:
   * 
   * ひとつのアイテムは、最大で10回/秒まで他のハンドルに対して操作することができます。
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   *
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   * 
   * @param velocity 加えられる速度 (グローバル座標)
   */
  addVelocity(velocity: Vector3): void

  /**
   * プレイヤーの移動速度の倍率を変更します。初期値は1です。
   * 
   * {@link PlayerScript.setMoveSpeedRate | PlayerScript.setMoveSpeedRate}と設定を共有します。
   * あとから呼び出した方の値で上書きされます。
   * 
   * #### 頻度の制限:
   * 
   * ひとつのアイテムは、最大で10回/秒まで他のハンドルに対して操作することができます。
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   * 
   * @param moveSpeedRate 移動速度の倍率
   */
  setMoveSpeedRate(moveSpeedRate: number): void

  /**
   * プレイヤーのジャンプ速度の倍率を変更します。初期値は1です。
   * 
   * {@link PlayerScript.setJumpSpeedRate | PlayerScript.setJumpSpeedRate}と設定を共有します。
   * あとから呼び出した方の値で上書きされます。
   * 
   * #### 頻度の制限:
   * 
   * ひとつのアイテムは、最大で10回/秒まで他のハンドルに対して操作することができます。
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   * 
   * @param jumpSpeedRate ジャンプ速度の倍率
   */
  setJumpSpeedRate(jumpSpeedRate: number): void

  /**
   * プレイヤーにかかる重力加速度（単位：m/s^2）を変更します。初期値は-9.81です。
   * 
   * {@link PlayerScript.setGravity | PlayerScript.setGravity}と設定を共有します。
   * あとから呼び出した方の値で上書きされます。
   * 
   * #### 頻度の制限:
   * 
   * ひとつのアイテムは、最大で10回/秒まで他のハンドルに対して操作することができます。
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   * 
   * @param gravity 重力加速度
   */
  setGravity(gravity: number): void

  /**
   * プレイヤーに設定された移動速度、ジャンプ速度、重力をリセットします。
   * {@link PlayerScript}で指定された移動速度、ジャンプ速度、重力もリセットされます。
   * 
   * #### 頻度の制限:
   * 
   * ひとつのアイテムは、最大で10回/秒まで他のハンドルに対して操作することができます。
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   */
  resetPlayerEffects(): void

  /**
   * @beta プレイヤーのヒューマノイドボーンの位置を取得します。
   * 値はグローバル座標です。
   * アバターのロードが完了していない場合や、アバターにボーンが存在しない場合は`null`が返されます。
   * 
   * @param bone ヒューマノイドボーン
   */
  getHumanoidBonePosition(bone: HumanoidBone): Vector3 | null

  /**
   * @beta プレイヤーのヒューマノイドボーンの回転を取得します。
   * 値はグローバル座標です。
   * アバターのロードが完了していない場合や、アバターにボーンが存在しない場合は`null`が返されます。
   * 
   * @param bone ヒューマノイドボーン
   */
  getHumanoidBoneRotation(bone: HumanoidBone): Quaternion | null

  /**
   * プレイヤーに文字列の入力を要求します。
   *
   * 入力要求を受けたプレイヤーには文字入力用のUIが表示されます。
   * プレイヤーが入力した文字列は{@link ClusterScript.onTextInput | ClusterScript.onTextInput}に設定したコールバックで受け取ることができます。
   * プレイヤーが入力できる文字列は、サイズが1000byte以下かつ文字数が250以下（ただしASCIIは1文字当たり0.5文字で換算します）に制限されます。
   * プレイヤーが入力要求に応答できない場合、送られた要求は自動的に拒否されます。
   * 例えば、入力要求を受け取って文字列を入力している最中に新たに入力要求を受け取った場合はこれに該当します。
   * また、プレイヤーは入力要求を意図的に拒否することが可能です。
   * これらの入力要求の成否は{@link TextInputStatus}で表されます。
   * @example
   * ```ts
   * $.onInteract(player => {
   *   player.requestTextInput("ask_name", "Hi, what is your name?");
   * });
   * ```
   * #### 頻度の制限:
   * 
   * ひとつのアイテムは、最大で10回/秒まで他のハンドルに対して操作することができます。
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   *
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   * 
   * @param meta 100 byte以下の文字列です。複数のrequestTextInput呼び出しを識別するために利用できます。空文字や、同じ文字列を複数回指定しても問題ありません。
   * @param title 入力要求を受けたプレイヤーの画面に表示される文字列です。200 byte以下である必要があります。
   */
  requestTextInput(meta: string, title: string): void

  /**
   * @beta プレイヤーにポストプロセスエフェクトを設定します。
   *
   * このメソッドを呼び出すたびに、以前設定されていたPostProcessEffectsは新しいPostProcessEffectsで上書きされます。
   *
   * nullを設定するとすべてのエフェクトがクリアされます。
   *
   * {@link PlayerScript.setPostProcessEffects | PlayerScript.setPostProcessEffects}と設定を共有します。
   * あとから呼び出した方の値で上書きされます。
   *
   * #### 頻度の制限:
   *
   * ひとつのアイテムは、最大で10回/秒まで他のハンドルに対して操作することができます。
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   *
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   * 
   * @example
   * ```ts
   * // Interactするととても眩しくなるアイテム
   * $.onInteract((player) => {
   *     const effects = new PostProcessEffects();
   *     effects.bloom.active = true;
   *     effects.bloom.threshold.setValue(0.5);
   *     effects.bloom.intensity.setValue(10.0);
   *     player.setPostProcessEffects(effects);
   * });
   * ```
   *
   * @param effects PostProcessEffectsのインスタンス。
   */
  setPostProcessEffects(effects: PostProcessEffects | null): void

  /**
   * PlayerScriptにメッセージを送ります。
   * 送られた対象は{@link PlayerScript.onReceive | PlayerScript.onReceive}に設定したコールバックを呼ぶことが期待されます。
   * 
   * 既に退室したプレイヤーに対してや、無効なPlayerHandleに対しては無視されます。
   * 
   * メッセージのペイロード（`arg`引数）に使用できるデータについては{@link Sendable}を参照してください。
   *
   * PlayerScriptに対して送信された{@link Sendable}は{@link PlayerScriptSendable}に変換されます。
   * 具体的には{@link ItemHandle}が{@link ItemId}に、{@link PlayerHandle}が{@link PlayerId}に変換されます。
   *
   * `undefined` など、Sendableではない値をペイロードとして`arg`引数に渡した場合、無視されます。
   * この挙動は将来的に変更される可能性があります。
   * 
   * @example
   * 以下は適当なメッセージを送る例です。
   * ```ts
   * playerHandle.send("damage", 20);
   * ```
   *
   * 以下の例では、アイテムにInteractしたプレイヤーに対して、アイテムのハンドルを送ります。
   * ```ts
   * $.onInteract(player => {
   *   player.send("item-handle", $.itemHandle);
   * });
   * ```
   *
   * 受け取ったメッセージをどう処理するかは、受け取る側のPlayerScriptの{@link PlayerScript.onReceive | PlayerScript.onReceive}に記述します。
   * 以下の例では、受け取ったItemIdを変数に格納します。
   * このItemIdに対して、必要なときにメッセージの{@link PlayerScript.sendTo | PlayerScript.sendTo}などの処理が行えます。
   * ```ts
   * let itemId = null
   * _.onReceive((messageType, arg, sender) => {
   *   switch (messageType) {
   *     case "item-handle":
   *       itemId = arg;
   *       break;
   *   }
   * });
   * ```
   *
   * #### 頻度の制限:
   *
   * sendを呼び出すことができる頻度には制限があります。
   * - このスクリプトを実行しているアイテムがクラフトアイテムであった場合、ひとつのアイテムあたり10回/秒以下
   * - このスクリプトを実行しているアイテムがワールドアイテムであった場合、スペース内の全てのワールドアイテムからの {@link ItemHandle.send}, {@link PlayerHandle.send}, {@link PlayerScript.sendTo} の呼び出し回数の合計が3000回/秒以下
   * 
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   * 
   * #### 流量制御による制限:
   * 
   * このスクリプトを実行しているアイテムがワールドアイテムである場合、sendが動作するためには、流量制御による遅延が30秒以下である必要があります。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * #### 容量の制限:
   *
   * エンコードされた`arg`のデータサイズは1000byte以下である必要があります。
   * データサイズが制限を超えている場合、警告が表示されます。
   * データサイズは{@link ClusterScript.computeSendableSize}で計算できます。
   *
   * データサイズが制限を大きく超えている場合、{@link ClusterScriptError} (`requestSizeLimitExceeded`) が発生しsendは失敗します。
   *
   * @param messageType メッセージの種別を表す100byte以下の任意の文字列
   * @param arg メッセージのペイロード
   */
  send(messageType: string, arg: Sendable): void;

  /**
   * プレイヤーにワールド内商品の購入をリクエストします。
   *
   * 商品の購入をリクエストされたプレイヤーには商品購入ダイアログが表示されます。
   * 商品購入リクエストの結果は、 {@link ClusterScript.onRequestPurchaseStatus | ClusterScript.onRequestPurchaseStatus} のcallbackで受け取ります。
   *
   * プレイヤーが商品を購入した場合、 {@link ClusterScript.onPurchaseUpdated | ClusterScript.onPurchaseUpdated} のcallbackが呼び出されます。
   *
   * プレイヤーが商品を購入せずにダイアログを閉じた場合、購入はキャンセルされます。
   *
   * プレイヤーが商品購入ダイアログを表示できない場合、送られたリクエストは無視されます。
   * 例えば、既に商品購入ダイアログが表示されている状態はこれに該当します。
   *
   * #### ルーム種別による挙動の違い:
   *
   * イベント会場で実行された場合、商品購入を行うことはできません。{@link ClusterScript.onRequestPurchaseStatus | ClusterScript.onRequestPurchaseStatus} を登録している場合、callbackのstatusとして {@link PurchaseRequestStatus.NotAvailable | PurchaseRequestStatus.NotAvailable } が渡されます。
   *
   * #### 頻度の制限:
   *
   * ひとつのアイテムは、最大で10回/秒まで他のハンドルに対して操作することができます。
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   *
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   * 
   * @example
   * ```ts
   * const productId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
   *
   * $.onStart(() => {
   *   // プレイヤーの商品所持状況をstateに保存する
   *   $.state.amounts = {};
   *   // 購入通知を購読する
   *   $.subscribePurchase(productId);
   * });
   *
   * $.onUpdate(deltaTime => {
   *   // 10秒に1回、定期的に全プレイヤーの購入状況を確認する
   *   let timer = $.state.timer ?? 0;
   *   timer -= deltaTime;
   *   if (timer <= 0) {
   *     timer += 10;
   *     const allPlayers = $.getPlayersNear(new Vector3(), Infinity);
   *     $.getOwnProducts(productId, allPlayers, "onUpdate");
   *   }
   *   $.state.timer = timer;
   * });
   *
   * $.onPurchaseUpdated((player, productId) => {
   *   // 商品が購入された場合、直ちにそのプレイヤーの購入状況を確認する
   *   $.getOwnProducts(productId, player, "onPurchaseUpdated");
   * });
   *
   * $.onGetOwnProducts((ownProducts, meta, errorReason) => {
   *   // 商品の所持状況をstateに書き込む
   *   let amounts = $.state.amounts;
   *   for (let ownProduct of ownProducts) {
   *     let playerId = ownProduct.player.id;
   *     let oldAmount = amounts[playerId] ?? 0;
   *     let newAmount = ownProduct.plusAmount - ownProduct.minusAmount;
   *     amounts[playerId] = newAmount;
   *   }
   *   $.state.amounts = amounts;
   * });
   * ```
   *
   * @param productId 購入をリクエストする商品のIDです。
   * @param meta 100 byte以下の文字列です。複数のrequestPurchase呼び出しを識別するために利用できます。空文字や、同じ文字列を複数回指定しても問題ありません。
   */
  requestPurchase(productId: string, meta: string): void;

  /**
   * イベントにおけるプレイヤーのロールを取得します。
   * プレイヤーの存在する空間がイベントではない場合は`null`を返します。
   * プレイヤーが入場した直後は`null`を返すことがあります。
   *
   * プレイヤーが存在しないとき、`null`を返します。プレイヤーの存在は{@link PlayerHandle.exists}で確認できます。
   *
   * @returns プレイヤーのイベントのロール
   */
  getEventRole(): EventRole | null;

  /**
   * プレイヤーが現在使用しているアバター商品の商品IDを取得します。
   *
   * 使用しているアバターが商品でない場合は `null` を返します。\
   * プレイヤーがアバターメイカーを起動している間は、アバターメイカー起動前に使用していたアバターの商品IDを返します。\
   * プレイヤーがアバターを変更した直後は、直前に使用していたアバターの商品IDを返すことがあります。\
   * プレイヤーが入場した直後は `null` を返すことがあります。\
   * プレイヤーが存在しないとき、`null` を返します。プレイヤーの存在は{@link PlayerHandle.exists}で確認できます。
   *
   * @returns プレイヤーが現在使用しているアバターの商品ID
   */
  getAvatarProductId(): string | null;

  /**
   * プレイヤーが現在使用しているアクセサリー商品の商品IDの配列を取得します。
   *
   * 使用しているアクセサリーが商品でない場合は配列に含まれません。\
   * プレイヤーがアクセサリーを編集している間は、アクセサリー編集前に使用していたアクセサリーの商品IDを返します。\
   * プレイヤーがアクセサリーを保存した直後は、直前に使用していたアクセサリーの商品IDを返すことがあります。\
   * プレイヤーが入場した直後は空の配列を返すことがあります。\
   * プレイヤーが存在しないとき、空の配列を返します。プレイヤーの存在は{@link PlayerHandle.exists}で確認できます。
   *
   * @returns プレイヤーが現在使用しているアクセサリーの商品IDの配列
   */
  getAccessoryProductIds(): string[];

  /**
   * プレイヤーに商品付与を行います。
   *
   * 商品付与を行うと、対象のプレイヤーは商品を購入した時と同じく商品を所持した状態になり、商品を使用することができます。\
   * 実行結果は {@link ClusterScript.onRequestGrantProductResult | ClusterScript.onRequestGrantProductResult} に設定したコールバックで受け取ることができます。
   *
   * #### 付与可能な商品:
   *
   * 付与可能な商品は以下の通りです。
   * - クラフトアイテム商品
   * - アクセサリー商品
   * - アバター商品
   *
   * 商品は販売可能なものとしてストアに公開されている必要があります。一度ストアに公開した商品は、後から公開設定を変更しても付与できます。
   *
   * #### 商品付与の実行制限:
   *
   * ワールドアイテムからこのメソッドを呼び出す場合、ワールドアイテムのクリエイターと商品の販売者が一致している場合に付与できます。\
   * クラフトアイテムからこのメソッドを呼び出す場合、クラフトアイテムのクリエイターと商品の販売者が一致している場合に付与できます。\
   * 例えば、他人が販売している商品を付与する事はできませんが、商品の販売者が自身の商品を付与するクラフトアイテムを販売した場合、他のプレイヤーはその商品を購入・使用して商品を付与する事ができます。
   *
   * 上記制限はアップデート等により変更となる可能性があります。
   *
   * #### ルーム種別による挙動の違い:
   *
   * テスト用のスペースで呼び出された際、コールバックの引数 {@link ProductGrantResult.status | result.status} は付与対象のプレイヤーが商品の販売者であることやプレイヤーの商品の所持状況に関わらず `"Granted"` を示しますが、実際には商品付与は実施されません。
   *
   * #### 流量制御:
   *
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   *
   * @example
   * ```ts
   * const productId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
   *
   * // PlayerHandle.requestGrantProductの結果を受け取れるようにする
   * $.onRequestGrantProductResult((result) => {
   *     $.log(`status: ${result.status}, productId: ${result.productId}, productName: ${result.productName}, playerId: ${result.player.id}, meta: ${result.meta}, errorReason: ${result.errorReason}`);
   *     const status = result.status;
   *     switch (status) {
   *         case "Granted":
   *         case "AlreadyOwned":
   *             if (result.player.exists()) {
   *                 $.log(`${result.player.userDisplayName} granted product: ${result.productName}`);
   *             }
   *             break;
   *         default:
   *             $.log(`status: ${status}, errorReason: ${result.errorReason}`);
   *             break;
   *     }
   * });
   *
   * // インタラクトしたプレイヤーに商品を付与する
   * $.onInteract((player) => {
   *     player.requestGrantProduct(productId, `${productId}_${player.id}`);
   * });
   * ```
   *
   * @param productId 付与する商品のIDです。[商品管理画面](https://cluster.mu/account/products/avatars)の各商品詳細にある「ワールド・イベントでの販売許可」の項目からIDをコピーすることが可能です。
   * @param meta 100 byte以下の文字列です。複数のrequestGrantProductの呼び出しを識別するために利用できます。空文字や、同じ文字列を複数回指定しても問題ありません。
   */
  requestGrantProduct(productId: string, meta: string): void;
}

/**
 * 音声を操作するハンドルです。
 * @item
 */
interface ApiAudio {
  /**
   * 音声を再生します。
   * 
   * 再生中の音声に対して実行した場合、現在の再生を停止し、再度再生します。
   */
  play(): void;

  /**
   * 音声を停止します。
   */
  stop(): void;

  /**
   * 音声の音量を表すプロパティです。
   * 
   * 初期値は1で、0以上2.5以下の値をとります。
   */
  volume: number;

  /**
   * 音声の再生位置となるSubNodeを指定します。
   * 
   * 存在しないSubNodeが指定された場合は音声の再生位置がアイテムのルート位置になります。
   * 
   * @param v 
   */
  attach(subNode: SubNode): void;

  /**
   * 音声の再生位置をアイテムのルート位置にします。
   */
  attachToRoot(): void;
}

/**
 * クォータニオンです。
 * 
 * 値を操作するメソッドは基本的に破壊的操作であるため、影響を与えたくない場合は明示的に`clone()`を呼び出してインスタンスを複製してください。
 */
declare class Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor();
  constructor(x: number, y: number, z: number, w: number);

  /**
   * 自身の値と`v`を比較し、ほとんど等しいときに`true`を返します。
   * 
   * @param v
   */
  equals(v: Quaternion): boolean;
  /**
   * 自身の`x`, `y`, `z`, `w`成分の値を設定します。
   * 
   * @param x 
   * @param y 
   * @param z 
   * @param w 
   */
  set(x: number, y: number, z: number, w: number): this;
  /**
   * `axis`の周りを`degree`度回転する値で自身を更新します。
   * 
   * @example
   * ```ts
   * new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 90);
   * ```
   * 
   * @param axis 
   * @param degree 
   * 
   */
  setFromAxisAngle(axis: Vector3, degree: number): this;
  /**
   * オイラー角表現での回転で自身を更新します。軸の適用順序はZXYの順となります。
   * 
   * @example
   * ```ts
   * new Quaternion().setFromEulerAngles(new Vector3(90, 0, 0));
   * ```
   * 
   * @param v 
   */
  setFromEulerAngles(v: Vector3): this;
  /**
   * オイラー角表現での回転で自身を更新します。軸の適用順序はZXYの順となります。
   * 
   * @example
   * ```ts
   * new Quaternion().setFromEulerAngles(90, 0, 0);
   * ```
   * 
   * @param x 
   * @param y 
   * @param z 
   */
  setFromEulerAngles(x: number, y: number, z: number): this;
  /**
   * オイラー角表現での回転の値を返します。
   */
  createEulerAngles(): Vector3;
  /**
   * インスタンスを複製します。
   */
  clone(): Quaternion;
  /**
   * `v`の値を自身に乗算します。
   * 
   * @param v 
   */
  multiply(v: Quaternion): this;
  /**
   * 自身の値を単位回転で更新します。これは回転のない状態を指します。
   */
  identity(): this;
  /**
   * 自身の値を反転します。
   */
  invert(): this;
  /**
   * 自身の値を正規化します。
   */
  normalize(): this;
  /**
   * 自身と`v`の回転の内積を計算します。
   * @param v 
   */
  dot(v: Quaternion): number;
  /**
   * 自身（クォータニオン）を4次元のベクトルとみたときの長さを返します。
   */
  length(): number;
  /**
   * 自身（クォータニオン）を4次元のベクトルとみたときの2乗の長さを返します。
   */
  lengthSq(): number;
  /**
   * 自身 と `v` の間を `a` で球状に補間した値を計算し、計算結果で自身の値を更新します。
   * 
   * @example
   * ```ts
   * let min = new Quaternion().identity();
   * let max = new Quaternion().setFromEulerAngles(0, 45, 0);
   * min.clone().slerp(max, 0.5);
   * ```
   * 
   * @param v 
   * @param a 補間の範囲を [0, 1] で指定します。
   */
  slerp(v: Quaternion, a: number): this;

  /**
   * 回転を軸と角度に分離した値を取得します。
   */
  toAxisAngle(): AxisAngle;

  /**
   * オイラー角で回転を指定してQuaternionを生成します。軸の適用順序はZXYの順となります。
   * 
   * @param angles 
   * 
   * @group Static Methods
   */
  static euler(angles: Vector3): Quaternion;

  /**
   * オイラー角を回転を指定してQuaternionを生成します。軸の適用順序はZXYの順となります。
   * 
   * @param x
   * @param y
   * @param z
   * 
   * @group Static Methods
   */
  static euler(x: number, y: number, z: number): Quaternion;

  /**
   * `axis`の周りを`degree`度回転するようなQuaternionを生成します。
   * 
   * @example
   * ```ts
   * let q = Quaternion.axisAngle(new Vector3(0, 1, 0), 90);
   * ```
   * 
   * @param axis 
   * @param angle 
   * 
   * @group Static Methods
   */
  static axisAngle(axis: Vector3, angle: number): Quaternion;

  /**
   * ある方向から別の方向へ向きを変更するような回転を表すQuaternionを生成します。
   * 
   * @param from 
   * @param to 
   * 
   * @group Static Methods
   */
  static fromToRotation(from: Vector3, to: Vector3): Quaternion;

  /**
   * `forward` の方向へ向き、かつ上方向が `up` の向きとなるような回転を表すQuaternionを生成します。
   * 
   * `up`は省略可能であり、省略した場合は `new Vector3(0, 1, 0)` を指定したのと同様に扱われます。
   * 
   * @param forward 
   * @param up 
   * 
   * @group Static Methods
   */
  static lookRotation(forward: Vector3, up: Vector3): Quaternion;
}

/** 
 * 回転を軸と角度の組で表現したデータです。
 * {@link Quaternion.toAxisAngle | Quaternion.toAxisAngle} で取得できます。
 */
interface AxisAngle {

  /** 
   * 回転軸を表すベクトルです。
   */
  readonly axis: Vector3;

  /** 
   * 回転の角度を度数法で表した数値です。0以上360以下の値をとります。
   */
  readonly angle: number;
}

/**
 * 3Dベクトルです。
 * 
 * 値を操作するメソッドは基本的に破壊的操作であるため、影響を与えたくない場合は明示的に`clone()`を呼び出してインスタンスを複製してください。
 */
declare class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor();
  constructor(x: number, y: number, z: number);

  /**
   * 自身の値と`v`を比較し、ほとんど等しいときに`true`を返します。
   * 
   * @param v
   */
  equals(v: Vector3): boolean;
  /**
   * 自身の`x`, `y`, `z`成分の値を設定します。
   * 
   * @param x 
   * @param y 
   * @param z 
   */
  set(x: number, y: number, z: number): this;
  /**
   * インスタンスを複製します。
   */
  clone(): Vector3;
  /**
   * `v`の値を自身に加算します。
   * 
   * @param v 
   */
  add(v: Vector3): this;
  /**
   * スカラー値`s`を自身の`x`, `y`, `z`成分に加算します。
   * @param s 
   */
  addScalar(s: number): this;
  /**
   * `v`の値で自身から減算します。
   * 
   * @param v 
   */
  sub(v: Vector3): this;
  /**
   * スカラー値`s`で自身の`x`, `y`, `z`成分を減算します。
   * @param s 
   */
  subScalar(s: number): this;
  /**
   * `v`の値を自身に乗算します。
   * 
   * @param v 
   */
  multiply(v: Vector3): this;
  /**
   * スカラー値`s`を自身に乗算します。
   * 
   * @param s 
   */
  multiplyScalar(s: number): this;
  /**
   * `v`の値で自身を除算します。
   * 
   * @param v 
   */
  divide(v: Vector3): this;
  /**
   * スカラー値`s`で自身を除算します。
   * 
   * @param s 
   */
  divideScalar(s: number): this;
  /**
   * 自身の値を反転します。
   */
  negate(): this;
  /**
   * 自身の値を正規化します。
   */
  normalize(): this;
  /**
   * 自身と`v`のベクトルの内積を計算します。
   * 
   * @param v 
   */
  dot(v: Vector3): number;
  /**
   * 自身と`v`のベクトルの外積を計算し、計算結果で自身の値を更新します。
   * 
   * @param v 
   */
  cross(v: Vector3): this;
  /**
   * 自身（ベクトル）の長さを返します。
   */
  length(): number;
  /**
   * 自身（ベクトル）の2乗の長さを返します。
   */
  lengthSq(): number;
  /**
   * 自身 と `v` の間を `a` で線形に補間した値を計算し、計算結果で自身の値を更新します。
   * 
   * @param v 
   * @param a 補間の範囲を [0, 1] で指定します。
   */
  lerp(v: Vector3, a: number): this;
  /**
   * `q`の回転を自身に適用します。
   * 
   * @param q 
   */
  applyQuaternion(q: Quaternion): this
}

/**
 * 2Dベクトルです。
 * 
 * 値を操作するメソッドは基本的に破壊的操作であるため、影響を与えたくない場合は明示的に`clone()`を呼び出してインスタンスを複製してください。
 */
declare class Vector2 {
  x: number;
  y: number;

  constructor();
  constructor(x: number, y: number)

  /**
   * 自身の値と`v`を比較し、ほとんど等しいときに`true`を返します。
   * 
   * @param v
   */
  equals(v: Vector2): boolean;
  /**
   * 自身の`x`, `y`成分の値を設定します。
   * 
   * @param x 
   * @param y 
   */
  set(x: number, y: number): this;
  /**
   * インスタンスを複製します。
   */
  clone(): Vector2;
  /**
   * `v`の値を自身に加算します。
   * 
   * @param v 
   */
  add(v: Vector2): this;
  /**
   * スカラー値`s`を自身の`x`, `y`成分に加算します。
   * @param s 
   */
  addScalar(s: number): this;
  /**
   * `v`の値で自身から減算します。
   * 
   * @param v 
   */
  sub(v: Vector2): this;
  /**
   * スカラー値`s`で自身の`x`, `y`成分を減算します。
   * @param s 
   */
  subScalar(s: number): this;
  /**
   * `v`の値を自身に乗算します。
   * 
   * @param v 
   */
  multiply(v: Vector2): this;
  /**
   * スカラー値`s`を自身に乗算します。
   * 
   * @param s 
   */
  multiplyScalar(s: number): this;
  /**
   * `v`の値で自身を除算します。
   * 
   * @param v 
   */
  divide(v: Vector2): this;
  /**
   * スカラー値`s`で自身を除算します。
   * 
   * @param s 
   */
  divideScalar(s: number): this;
  /**
   * 自身の値を反転します。
   */
  negate(): this;
  /**
   * 自身の値を正規化します。
   */
  normalize(): this;
  /**
   * 自身と`v`のベクトルの内積を計算します。
   * 
   * @param v 
   */
  dot(v: Vector2): number;
  /**
   * 自身と`v`のベクトルの2Dの外積の大きさを計算します。
   * 
   * @param v 
   */
  cross(v: Vector2): number;
  /**
   * 自身（ベクトル）の長さを返します。
   */
  length(): number;
  /**
   * 自身（ベクトル）の2乗の長さを返します。
   */
  lengthSq(): number;
  /**
   * 自身 と `v` の間を `a` で線形に補間した値を計算し、計算結果で自身の値を更新します。
   * 
   * @param v 
   * @param a 補間の範囲を [0, 1] で指定します。
   */
  lerp(v: Vector2, a: number): this;
}

/**
 * 4Dベクトルです。
 * 
 * 値を操作するメソッドは基本的に破壊的操作であるため、影響を与えたくない場合は明示的に`clone()`を呼び出してインスタンスを複製してください。
 */
declare class Vector4 {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor();
  constructor(x: number, y: number, z: number, w: number);

  /**
   * 自身の値と`v`を比較し、ほとんど等しいときに`true`を返します。
   * 
   * @param v
   */
  equals(v: Vector4): boolean;

  /**
   * 自身の`x`, `y`, `z`, `w`成分の値を設定します。
   * 
   * @param x 
   * @param y 
   * @param z 
   * @param w
   */
  set(x: number, y: number, z: number, w: number): this;

  /**
   * インスタンスを複製します。
   */
  clone(): Vector4;

  /**
   * 自身 と `v` の間を `a` で線形に補間した値を計算し、計算結果で自身の値を更新します。
   * 
   * @param v 
   * @param a 補間の範囲を [0, 1] で指定します。
   */
  lerp(v: Vector4, a: number): this;
}

/**
 * 色を表すデータ型です。
 * `r`, `g`, `b`, `a` の各要素は [0, 1] の範囲で指定します。
 * 
 * 値を操作するメソッドは基本的に破壊的操作であるため、影響を与えたくない場合は明示的に`clone()`を呼び出してインスタンスを複製してください。
 */
declare class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  /** 
   * 全ての成分の値を0で初期化してインスタンスを生成します。
   */
  constructor();

  /** 
   * RGB成分を指定してインスタンスを生成します。 `a` の値は1として初期化されます。
   */
  constructor(r: number, g: number, b: number);
  
  /** 
   * RGBA成分を指定してインスタンスを生成します。
   */
  constructor(r: number, g: number, b: number, a: number);

  /**
   * 自身の値と`v`を比較し、ほとんど等しいときに`true`を返します。
   * 
   * @param v
   */
  equals(v: Color): boolean;

  /**
   * 自身の`r`, `g`, `b`, `a`成分の値を設定します。
   * 
   * @param r 
   * @param g
   * @param b
   * @param a
   */
  set(r: number, g: number, b: number, a: number): this;

  /**
   * 自身に対し、HSVを指定してRGB成分を更新します。`a` の値は更新されません。
   * 
   * `h`, `s`, `v`はいずれも [0, 1] の範囲で指定します。
   * 
   * @param h 
   * @param s 
   * @param v 
   */
  setFromHsv(h: number, s: number, v: number): this;

  /**
   * インスタンスを複製します。
   */
  clone(): Color;

  /**
   * 自身 と `c` の間を `t` で線形に補間した値を計算し、計算結果で自身の値を更新します。
   * 
   * @param c 
   * @param t 補間の範囲を [0, 1] で指定します。
   */
  lerp(c: Color, t: number): this;
}

/**
 * ヒューマノイドモデルのボーンです。
 */
declare enum HumanoidBone {
  Hips,
  LeftUpperLeg,
  RightUpperLeg,
  LeftLowerLeg,
  RightLowerLeg,
  LeftFoot,
  RightFoot,
  Spine,
  Chest,
  Neck,
  Head,
  LeftShoulder,
  RightShoulder,
  LeftUpperArm,
  RightUpperArm,
  LeftLowerArm,
  RightLowerArm,
  LeftHand,
  RightHand,
  LeftToes,
  RightToes,
  LeftEye,
  RightEye,
  Jaw,
  LeftThumbProximal,
  LeftThumbIntermediate,
  LeftThumbDistal,
  LeftIndexProximal,
  LeftIndexIntermediate,
  LeftIndexDistal,
  LeftMiddleProximal,
  LeftMiddleIntermediate,
  LeftMiddleDistal,
  LeftRingProximal,
  LeftRingIntermediate,
  LeftRingDistal,
  LeftLittleProximal,
  LeftLittleIntermediate,
  LeftLittleDistal,
  RightThumbProximal,
  RightThumbIntermediate,
  RightThumbDistal,
  RightIndexProximal,
  RightIndexIntermediate,
  RightIndexDistal,
  RightMiddleProximal,
  RightMiddleIntermediate,
  RightMiddleDistal,
  RightRingProximal,
  RightRingIntermediate,
  RightRingDistal,
  RightLittleProximal,
  RightLittleIntermediate,
  RightLittleDistal,
  UpperChest,
}

/**
 * プレイヤーへの文字列入力の要求が正常に完了したかどうかを示すステータスコードです。{@link PlayerHandle.requestTextInput | PlayerHandle.requestTextInput}、{@link ClusterScript.onTextInput | ClusterScript.onTextInput}を参照してください。
 * @item
 */
declare enum TextInputStatus {
  /** プレイヤーが文字列の入力に成功したことを示します。 */
  Success,
  /** プレイヤーが文字列の入力を行うことができない状態のため、入力要求が自動的に拒否されたことを示します。 */
  Busy,
  /** プレイヤーが入力要求を意図的に拒否したことを意味します。 */
  Refused,
}

/**
 * 実行が許可されていない操作を実行したときに発生する例外です。
 * すべてのAPIはこの例外を投げる可能性があります。
 * 
 * 操作の実行が許可されるかどうかは、ベータ許可状態、距離、空間内の負荷、
 * ユーザーのステータスなど様々な要素によって動的に変化します。
 * 
 * 許可されていない操作の種類に応じてフィールドのboolean値がtrueになります。
 * 
 * 複数の許可が足りていない場合には
 * 複数のフィールドが同時にtrueになることがあります。
 */
interface ClusterScriptError extends Error {
  /**
   * このフィールドは後方互換性のために残されており、常にfalseとなります。
   */
  distanceLimitExceeded: boolean;
  /**
   * レート制限により実行が許可されていない場合、trueとなります。
   */
  rateLimitExceeded: boolean;
  /**
   * リクエストサイズ制限により実行が許可されていない場合、trueとなります。
   */
  requestSizeLimitExceeded: boolean;
  /**
   * 実行が許可されていない場合、trueとなります。
   * 
   * ベータ機能の使用が許可されていない環境でベータのAPIを呼び出した場合などに発生します。
   */
  executionNotAllowed: boolean;
  /**
   * エラーメッセージです。
   */
  message: string;
}

/**
 * ポストプロセスのエフェクトの設定値です。
 *
 * コンストラクタで作成し、 {@link PlayerHandle.setPostProcessEffects | PlayerHandle.setPostProcessEffects} または {@link PlayerScript.setPostProcessEffects | PlayerScript.setPostProcessEffects} でプレイヤーに設定します。
 *
 * 各Settingsの `active` プロパティは、そのSettingsの設定値が利用されるかどうかを設定します。
 *
 * {@link PlayerHandle.setPostProcessEffects | PlayerHandle.setPostProcessEffects} または {@link PlayerScript.setPostProcessEffects | PlayerScript.setPostProcessEffects} で設定されるポストプロセスは、UnityのPostProcessingのGlobalなVolumeとして表現され、Priorityは100として設定されます。
 *
 * 各Settingsの `enabled` はclearすることで、Creator Kitでアップロードしたワールドに設置されているPriorityが100より低いPostProcessingVolumeのenabledの状態を利用できます。
 * enabledの値は既定でtrueが設定されており、多くのユースケースではtrueから変更する必要はありません。
 * @beta
 */
declare class PostProcessEffects {
  grain: GrainSettings;
  bloom: BloomSettings;
  chromaticAberration: ChromaticAberrationSettings;
  colorGrading: ColorGradingSettings;
  depthOfField: DepthOfFieldSettings;
  lensDistortion: LensDistortionSettings;
  motionBlur: MotionBlurSettings;
  vignette: VignetteSettings;
  fog: FogSettings;

  constructor();
}

/**
 * ポストプロセスのBloomエフェクトの設定値です。
 * @item @beta
 */
interface BloomSettings {
  active: boolean;
  enabled: PostProcessBoolProperty;

  /**
   * Bloomエフェクトの強さを設定します。
   * 0以上の値を設定できます。
   * 0より小さい値を設定した場合、0が設定されます。
   */
  intensity: PostProcessFloatProperty;

  /**
   * Bloomエフェクトのしきい値を設定します。
   * 0以上の値を設定できます。
   * 0より小さい値を設定した場合、0が設定されます。
   */
  threshold: PostProcessFloatProperty;

  /**
   * Bloomエフェクトのしきい値の柔らかさを設定します。
   * 0以上1以下の値を設定できます。
   * 0より小さい値を設定した場合、0が設定されます。
   * 1より大きい値を設定した場合、1が設定されます。
   */
  softKnee: PostProcessFloatProperty;

  /**
   * Bloomエフェクトのクランプを設定します。
   * 0以上の値を設定できます。
   * 0より小さい値を設定した場合、0が設定されます。
   */
  clamp: PostProcessFloatProperty;

  /**
   * Bloomエフェクトのアナモルフィックエフェクトの強さを設定します。
   * -1以上1以下の値を設定できます。
   * -1より小さい値を設定した場合、-1が設定されます。
   */
  anamorphicRatio: PostProcessFloatProperty;

  /**
   * Bloomエフェクトの色を設定します。
   */
  color: PostProcessColorProperty;
}

/**
 * ポストプロセスのChromaticAberrationエフェクトの設定値です。
 * @item @beta
 */
interface ChromaticAberrationSettings {
  active: boolean;
  enabled: PostProcessBoolProperty;

  /**
   * ChromaticAberrationのエフェクトの強さを設定します。
   * 0以上1以下の値を設定できます。
   * 0より小さい値を設定した場合、0が設定されます。
   * 1より大きい値を設定した場合、1が設定されます。
   */
  intensity: PostProcessFloatProperty;
}

/**
 * ポストプロセスのColorGradingエフェクトの設定値です。
 * @item @beta
 */
interface ColorGradingSettings {
  active: boolean;
  enabled: PostProcessBoolProperty;

  /**
   * ColorGradingのエフェクトの温度を設定します。
   * -100以上100以下の値を設定できます。
   * -100より小さい値を設定した場合、-100が設定されます。
   * 100より大きい値を設定した場合、100が設定されます。
   */
  temperature: PostProcessFloatProperty;

  /**
   * ColorGradingのエフェクトのティントを設定します。
   * -100以上100以下の値を設定できます。
   * -100より小さい値を設定した場合、-100が設定されます。
   * 100より大きい値を設定した場合、100が設定されます。
   */
  tint: PostProcessFloatProperty;

  /**
   * ColorGradingのエフェクトの色フィルタを設定します。
   */
  colorFilter: PostProcessColorProperty;

  /**
   * ColorGradingのエフェクトの色相シフトを設定します。
   * -180以上180以下の値を設定できます。
   * -180より小さい値を設定した場合、-180が設定されます。
   * 180より大きい値を設定した場合、180が設定されます。
   */
  hueShift: PostProcessFloatProperty;

  /**
   * ColorGradingのエフェクトの彩度を設定します。
   * -100以上100以下の値を設定できます。
   * -100より小さい値を設定した場合、-100が設定されます。
   * 100より大きい値を設定した場合、100が設定されます。
   */
  saturation: PostProcessFloatProperty;

  /**
   * ColorGradingのエフェクトの明度を設定します。
   * -100以上100以下の値を設定できます。
   * -100より小さい値を設定した場合、-100が設定されます。
   * 100より大きい値を設定した場合、100が設定されます。
   */
  brightness: PostProcessFloatProperty;

  /**
   * ColorGradingのエフェクトのコントラストを設定します。
   * -100以上100以下の値を設定できます。
   * -100より小さい値を設定した場合、-100が設定されます。
   * 100より大きい値を設定した場合、100が設定されます。
   */
  contrast: PostProcessFloatProperty;

  /**
   * ColorGradingのエフェクトのRedのチャンネルミキサーを設定します。
   */
  channelMixerRed: ChannelMixerProperty;

  /**
   * ColorGradingのエフェクトのGreenのチャンネルミキサーを設定します。
   */
  channelMixerGreen: ChannelMixerProperty;

  /**
   * ColorGradingのエフェクトのBlueのチャンネルミキサーを設定します。
   */
  channelMixerBlue: ChannelMixerProperty;

  /**
   * ColorGradingのエフェクトのLiftを設定します。
   * x/y/zで色を、wでLiftの量を指定します。
   */
  lift: PostProcessVector4Property;

  /**
   * ColorGradingのエフェクトのGammaを設定します。
   * x/y/zで色を、wでGammaの量を指定します。
   */
  gamma: PostProcessVector4Property;

  /**
   * ColorGradingのエフェクトのGainを設定します。
   * x/y/zで色を、wでGainの量を指定します。
   */
  gain: PostProcessVector4Property;
}

/**
 * ポストプロセスのDepthOfFieldエフェクトの設定値です。
 * @item @beta
 */
interface DepthOfFieldSettings {
  active: boolean;
  enabled: PostProcessBoolProperty;

  /**
   * DepthOfFieldのエフェクトの焦点距離を設定します。
   * 0.1以上の値を設定できます。
   * 0.1より小さい値を設定した場合、0.1が設定されます。
   */
  focusDistance: PostProcessFloatProperty;

  /**
   * DepthOfFieldのエフェクトの絞り値を設定します。
   * 0.05以上32以下の値を設定できます。
   * 0.05より小さい値を設定した場合、0.05が設定されます。
   * 32より大きい値を設定した場合、32が設定されます。
   */
  aperture: PostProcessFloatProperty;

  /**
   * DepthOfFieldのエフェクトの焦点距離の近接値を設定します。
   * 1以上300以下の値を設定できます。
   * 1より小さい値を設定した場合、1が設定されます。
   * 300より大きい値を設定した場合、300が設定されます。
   */
  focalLength: PostProcessFloatProperty;
}

/**
 * ポストプロセスのFogエフェクトの設定値です。
 * @item @beta
 */
interface FogSettings {
  active: boolean;
  enabled: PostProcessBoolProperty;

  /**
   * Fogのエフェクトの色を設定します。
   */
  color: PostProcessColorProperty;

  /**
   * Fogのエフェクトのモードを設定します。
   * `"Linear"`、`"Exponential"`、`"ExponentialSquared"`のいずれかの値を指定できます。
   * これ以外の文字列が指定されていた場合、clearされた状態として設定されます。
   */
  mode: PostProcessStringProperty;

  /**
   * Fogのエフェクトの開始位置を設定します。
   * modeが`"Linear"`の際に使用されます。
   */
  start: PostProcessFloatProperty;

  /**
   * Fogのエフェクトの終了位置を設定します。
   * modeが`"Linear"`の際に使用されます。
   */
  end: PostProcessFloatProperty;

  /**
   * Fogのエフェクトの密度を設定します。
   * modeが`"Exponential"`、`"ExponentialSquared"`の際に使用されます。
   */
  density: PostProcessFloatProperty;
}

/**
 * ポストプロセスのGrainエフェクトの設定値です。
 * @item @beta
 */
interface GrainSettings {
  active: boolean;
  enabled: PostProcessBoolProperty;

  /**
   * Grainのエフェクトがカラーかどうかを設定します。
   */
  colored: PostProcessBoolProperty;

  /**
   * Grainのエフェクトの強さを設定します。
   * 0以上1以下の値を設定できます。
   * 0より小さい値を設定した場合、0が設定されます。
   * 1より大きい値を設定した場合、1が設定されます。
   */
  intensity: PostProcessFloatProperty;

  /**
   * Grainのエフェクトのサイズを設定します。
   * 0.3以上3以下の値を設定できます。
   * 0.3より小さい値を設定した場合、0.3が設定されます。
   * 3より大きい値を設定した場合、3が設定されます。
   */
  size: PostProcessFloatProperty;

  /**
   * GrainのエフェクトのLuminance Contributionを設定します。
   * 0以上1以下の値を設定できます。
   * 0より小さい値を設定した場合、0が設定されます。
   * 1より大きい値を設定した場合、1が設定されます。
   */
  luminanceContribution: PostProcessFloatProperty;
}

/**
 * ポストプロセスのLensDistortionエフェクトの設定値です。
 * @item @beta
 */
interface LensDistortionSettings {
  active: boolean;
  enabled: PostProcessBoolProperty;

  /**
   * LensDistortionのエフェクトの強さを設定します。
   * -100以上100以下の値を設定できます。
   * -100より小さい値を設定した場合、-100が設定されます。
   * 100より大きい値を設定した場合、100が設定されます。
   */
  intensity: PostProcessFloatProperty;

  /**
   * LensDistortionのエフェクトのX方向の倍率を設定します。
   * 0以上1以下の値を設定できます。
   * 0より小さい値を設定した場合、0が設定されます。
   * 1より大きい値を設定した場合、1が設定されます。
   */
  xMultiplier: PostProcessFloatProperty;

  /**
   * LensDistortionのエフェクトのY方向の倍率を設定します。
   * 0以上1以下の値を設定できます。
   * 0より小さい値を設定した場合、0が設定されます。
   * 1より大きい値を設定した場合、1が設定されます。
   */
  yMultiplier: PostProcessFloatProperty;

  /**
   * LensDistortionのエフェクトの中心のX座標を設定します。
   * -1以上1以下の値を設定できます。
   * -1より小さい値を設定した場合、-1が設定されます。
   * 1より大きい値を設定した場合、1が設定されます。
   */
  centerX: PostProcessFloatProperty;

  /**
   * LensDistortionのエフェクトの中心のY座標を設定します。
   * -1以上1以下の値を設定できます。
   * -1より小さい値を設定した場合、-1が設定されます。
   * 1より大きい値を設定した場合、1が設定されます。
   */
  centerY: PostProcessFloatProperty;

  /**
   * LensDistortionのエフェクトのスケールを設定します。
   * 0.01以上5以下の値を設定できます。
   * 0.01より小さい値を設定した場合、0.01が設定されます。
   * 5より大きい値を設定した場合、5が設定されます。
   */
  scale: PostProcessFloatProperty;
}

/**
 * ポストプロセスのMotionBlurエフェクトの設定値です。
 * @item @beta
 */
interface MotionBlurSettings {
  active: boolean;
  enabled: PostProcessBoolProperty;

  /**
   * MotionBlurのエフェクトのシャッターアングルを設定します。
   * 0以上360以下の値を設定できます。
   * 0より小さい値を設定した場合、0が設定されます。
   * 360より大きい値を設定した場合、360が設定されます。
   */
  shutterAngle: PostProcessFloatProperty;

  /**
   * MotionBlurのエフェクトのサンプル数を設定します。
   * 4以上32以下の値を設定できます。
   * 4より小さい値を設定した場合、4が設定されます。
   * 32より大きい値を設定した場合、32が設定されます。
   */
  sampleCount: PostProcessIntProperty;
}

/**
 * ポストプロセスのVignetteエフェクトの設定値です。
 * @item @beta
 */
interface VignetteSettings {
  active: boolean;
  enabled: PostProcessBoolProperty;

  /**
   * Vignetteのエフェクトの色を設定します。
   */
  color: PostProcessColorProperty;

  /**
   * Vignetteのエフェクトの中心を設定します。
   * スクリーンの左下を(0, 0)、右上を(1, 1)とする座標系で表されます。
   * スクリーンの中心をエフェクトの中心として設定する場合、(0.5, 0.5)を設定してください。
   */
  center: PostProcessVector2Property;

  /**
   * Vignetteのエフェクトの強さを設定します。
   * 0以上1以下の値を設定できます。
   * 0より小さい値を設定した場合、0が設定されます。
   * 1より大きい値を設定した場合、1が設定されます。
   */
  intensity: PostProcessFloatProperty;

  /**
   * Vignetteのエフェクトのスムーズネスを設定します。
   * 0.01以上1以下の値を設定できます。
   * 0.01より小さい値を設定した場合、0.01が設定されます。
   * 1より大きい値を設定した場合、1が設定されます。
   */
  smoothness: PostProcessFloatProperty;

  /**
   * Vignetteのエフェクトのラウンドネスを設定します。
   * 0以上1以下の値を設定できます。
   * 0より小さい値を設定した場合、0が設定されます。
   * 1より大きい値を設定した場合、1が設定されます。
   */
  roundness: PostProcessFloatProperty;

  /**
   * Vignetteのエフェクトの丸くするかを設定します。
   */
  rounded: PostProcessBoolProperty;
}

/**
 * ポストプロセスのエフェクトのbooleanのプロパティです。
 * @item @beta
 */
interface PostProcessBoolProperty {
  /**
   * プロパティの値を設定します。
   *
   * @param value 設定する値
   */
  setValue(value: boolean): void;

  /**
   * プロパティの値を設定されていない状態にクリアします。
   */
  clear(): void;
}

/**
 * ポストプロセスのエフェクトの数値のプロパティです。
 * @item @beta
 */
interface PostProcessFloatProperty {
  /**
   * プロパティの値を設定します。
   *
   * @param value 設定する値
   */
  setValue(value: number): void;

  /**
   * プロパティの値を設定されていない状態にクリアします。
   */
  clear(): void;
}

/**
 * ポストプロセスのエフェクトの整数のプロパティです。
 * @item @beta
 */
interface PostProcessIntProperty {
  /**
   * プロパティの値を設定します。
   *
   * @param value 設定する値
   */
  setValue(value: number): void;

  /**
   * プロパティの値を設定されていない状態にクリアします。
   */
  clear(): void;
}

/**
 * ポストプロセスのエフェクトの色のプロパティです。
 * @item @beta
 */
interface PostProcessColorProperty {
  /**
   * プロパティの値を設定します。
   * 色はLinearな色空間で指定します。
   * r, g, bの各成分に1以上の値を入れることでHDRの色を指定できます。
   *
   * @param r 赤成分の値
   * @param g 緑成分の値
   * @param b 青成分の値
   * @param a アルファ成分の値
   */
  setValue(r: number, g: number, b: number, a: number): void;

  /**
   * プロパティの値を設定されていない状態にクリアします。
   */
  clear(): void;
}

/**
 * ポストプロセスのエフェクトの文字列のプロパティです。
 * @item @beta
 */
interface PostProcessStringProperty {
  /**
   * プロパティの値を設定します。
   *
   * @param value 設定する値
   */
  setValue(value: string): void;

  /**
   * プロパティの値を設定されていない状態にクリアします。
   */
  clear(): void;
}

/**
 * ポストプロセスのエフェクトの2次元ベクトルのプロパティです。
 * @item @beta
 */
interface PostProcessVector2Property {
  /**
   * プロパティの値を設定します。
   *
   * @param x x成分の値
   * @param y y成分の値
   */
  setValue(x: number, y: number): void;

  /**
   * プロパティの値を設定されていない状態にクリアします。
   */
  clear(): void;
}

/**
 * ポストプロセスのエフェクトの4次元ベクトルのプロパティです。
 * @item @beta
 */
interface PostProcessVector4Property {
  /**
   * プロパティの値を設定します。
   *
   * @param x x成分の値
   * @param y y成分の値
   * @param z z成分の値
   * @param w w成分の値
   */
  setValue(x: number, y: number, z: number, w: number): void;

  /**
   * プロパティの値を設定されていない状態にクリアします。
   */
  clear(): void;
}

/**
 * ポストプロセスのエフェクトのチャンネルミキサーのプロパティです。
 * @item @beta
 */
interface ChannelMixerProperty {
  /**
   * redの値を指定します。
   * -200以上200以下の値を設定できます。
   */
  red: PostProcessFloatProperty;

  /**
   * greenの値を指定します。
   * -200以上200以下の値を設定できます。
   */
  green: PostProcessFloatProperty;

  /**
   * blueの値を指定します。
   * -200以上200以下の値を設定できます。
   */
  blue: PostProcessFloatProperty;
}

/**
 * マテリアルをスクリプトから操作するためのハンドルです。
 * @item
 */
interface MaterialHandle {
  /**
   * マテリアルのベースカラーを設定します。
   * このメソッドに渡した値はsRGB色空間の値として解釈されます。
   *
   * r, g, b, aの各要素は0以上1以下の値を取ります。
   * 0より小さい値を渡した場合、0が渡されます。
   * 1より大きい値を渡した場合、1が渡されます。
   *
   * いずれかの要素にNaNやInfinity、-Infinityを含む場合は、このメソッドの呼び出しは無視されます。
   */
  setBaseColor(r: number, g: number, b: number, a: number): void;

  /**
   * マテリアルのベースカラーを設定します。
   * このメソッドに渡した値はsRGB色空間の値として解釈されます。
   *
   * いずれかの要素にNaNやInfinity、-Infinityを含む場合は、このメソッドの呼び出しは無視されます。
   */
  setBaseColor(color: Color): void;

  /**
   * マテリアルのEmissiveの色を設定します。
   * このメソッドに渡した値はLinearの色空間のHDRの値として解釈されます。
   *
   * r, g, bは0以上の値を取ります。
   * 0より小さい値を渡した場合、0が渡されます。
   *
   * aは0以上1以下の値を取ります。
   * 0より小さい値を渡した場合、0が渡されます。
   * 1より大きい値を渡した場合、1が渡されます。
   *
   * いずれかの要素にNaNやInfinity、-Infinityを含む場合は、このメソッドの呼び出しは無視されます。
   */
  setEmissionColor(r: number, g: number, b: number, a: number): void;

  /**
   * マテリアルのEmissiveの色を設定します。
   * このメソッドに渡した値はLinearの色空間のHDRの値として解釈されます。
   *
   * いずれかの要素にNaNやInfinity、-Infinityを含む場合は、このメソッドの呼び出しは無視されます。
   */
  setEmissionColor(color: Color): void;

  /**
   * このAPIはCreatorKitからアップロードしたワールドでのみ利用可能です。
   * クラフトアイテムからはこのAPIは利用できません。
   *
   * マテリアルのColorプロパティの値を設定します。
   *
   * r, g, bは0以上の値を取ります。
   * 0より小さい値を渡した場合、0が渡されます。
   *
   * aは0以上1以下の値を取ります。
   * 0より小さい値を渡した場合、0が渡されます。
   * 1より大きい値を渡した場合、1が渡されます。
   *
   * いずれかの要素にNaNやInfinity、-Infinityを含む場合は、このメソッドの呼び出しは無視されます。
   *
   * HDRや色空間のGammaはShaderLabのプロパティ指定の`[HDR]`と`[Gamma]`の指定に従います。
   * `propertyName`は最大64文字までに対応しています。
   */
  setColor(propertyName: string, r: number, g: number, b: number, a: number): void;

  /**
   * このAPIはCreatorKitからアップロードしたワールドでのみ利用可能です。
   * クラフトアイテムからはこのAPIは利用できません。
   *
   * マテリアルのColorプロパティの値を設定します。
   *
   * いずれかの要素にNaNやInfinity、-Infinityを含む場合は、このメソッドの呼び出しは無視されます。
   *
   * HDRや色空間のGammaはShaderLabのプロパティ指定の`[HDR]`と`[Gamma]`の指定に従います。
   * `propertyName`は最大64文字までに対応しています。
   */
  setColor(propertyName: string, color: Color): void;

  /**
   * このAPIはCreatorKitからアップロードしたワールドでのみ利用可能です。
   * クラフトアイテムからはこのAPIは利用できません。
   *
   * マテリアルのFloat値のプロパティを設定します。
   * NaNやInfinity、-Infinityを渡した場合は、このメソッドの呼び出しは無視されます。
   *
   * HDRや色空間のGammaはShaderLabのプロパティ指定の`[HDR]`と`[Gamma]`の指定に従います。
   * `propertyName`は最大64文字までに対応しています。
   */
  setFloat(propertyName: string, value: number): void;

  /**
   * このAPIはCreatorKitからアップロードしたワールドでのみ利用可能です。
   * クラフトアイテムからはこのAPIは利用できません。
   *
   * マテリアルのFloat2の値のプロパティを設定します。
   * いずれかの要素にNaNやInfinity、-Infinityを含む場合は、このメソッドの呼び出しは無視されます。
   *
   * HDRや色空間のGammaはShaderLabのプロパティ指定の`[HDR]`と`[Gamma]`の指定に従います。
   * `propertyName`は最大64文字までに対応しています。
   */
  setFloat2(propertyName: string, x: number, y: number): void;

  /**
   * このAPIはCreatorKitからアップロードしたワールドでのみ利用可能です。
   * クラフトアイテムからはこのAPIは利用できません。
   *
   * マテリアルのFloat3の値のプロパティを設定します。
   * いずれかの要素にNaNやInfinity、-Infinityを含む場合は、このメソッドの呼び出しは無視されます。
   *
   * HDRや色空間のGammaはShaderLabのプロパティ指定の`[HDR]`と`[Gamma]`の指定に従います。
   * `propertyName`は最大64文字までに対応しています。
   */
  setFloat3(propertyName: string, x: number, y: number, z: number): void;

  /**
   * このAPIはCreatorKitからアップロードしたワールドでのみ利用可能です。
   * クラフトアイテムからはこのAPIは利用できません。
   *
   * マテリアルのFloat3の値のプロパティを設定します。
   * いずれかの要素にNaNやInfinity、-Infinityを含む場合は、このメソッドの呼び出しは無視されます。
   *
   * HDRや色空間のGammaはShaderLabのプロパティ指定の`[HDR]`と`[Gamma]`の指定に従います。
   * `propertyName`は最大64文字までに対応しています。
   */
  setFloat3(propertyName: string, v: Vector3): void;

  /**
   * このAPIはCreatorKitからアップロードしたワールドでのみ利用可能です。
   * クラフトアイテムからはこのAPIは利用できません。
   *
   * マテリアルのFloat4の値のプロパティを設定します。
   * いずれかの要素にNaNやInfinity、-Infinityを含む場合は、このメソッドの呼び出しは無視されます。
   *
   * HDRや色空間のGammaはShaderLabのプロパティ指定の`[HDR]`と`[Gamma]`の指定に従います。
   * `propertyName`は最大64文字までに対応しています。
   */
  setFloat4(propertyName: string, x: number, y: number, z: number, w: number): void;

  /**
   * このAPIはCreatorKitからアップロードしたワールドでのみ利用可能です。
   * クラフトアイテムからはこのAPIは利用できません。
   *
   * マテリアルのFloat4の値のプロパティを設定します。
   * いずれかの要素にNaNやInfinity、-Infinityを含む場合は、このメソッドの呼び出しは無視されます。
   *
   * HDRや色空間のGammaはShaderLabのプロパティ指定の`[HDR]`と`[Gamma]`の指定に従います。
   * `propertyName`は最大64文字までに対応しています。
   */
  setFloat4(propertyName: string, v: Vector4): void;

  /**
   * このAPIはCreatorKitからアップロードしたワールドでのみ利用可能です。
   * クラフトアイテムからはこのAPIは利用できません。
   *
   * マテリアルの行列のプロパティを設定します。
   *
   * 16要素のFloat32Arrayを渡します。
   * 要素数が16ではない場合にはエラーになります。
   * いずれかの要素にNaNやInfinity、-Infinityを含む場合は、このメソッドの呼び出しは無視されます。
   *
   * `propertyName`は最大64文字までに対応しています。
   */
  setMatrix(propertyName: string, matrix: Float32Array): void;
}

/**
 * `_`オブジェクトは、PlayerScriptのインスタンスです。
 *
 * [Player Scriptコンポーネント](https://docs.cluster.mu/creatorkit/item-components/player-script/)のスクリプト内でのみ利用できます。
 * `$.setPlayerScript(playerHandle)` を呼び出すことでPlayer Scriptコンポーネントのスクリプトをプレイヤーに設定することができます。
 *
 * Scriptable Itemのスクリプトとは実行環境が異なります。
 * Scriptable ItemとPlayer Scriptのスクリプトは独立して動作します。
 *
 * Scriptable Itemのスクリプトとは変数などが自動で共有されることはありません。
 * Scriptable ItemとPlayer Scriptのスクリプトの間で値を受け渡す場合は{@link PlayerScript.sendTo | PlayerScript.sendTo}や{@link PlayerHandle.send | PlayerHandle.send}を利用してください。
 *
 * PlayerScriptのスクリプトはScriptable Itemのスクリプトと異なり、定期的に環境がリセットされることはありません。
 * そのため、グローバル変数に状態を保存し、コールバックをまたいで利用することができます。
 *
 * @example
 * 以下はプレイヤースクリプトを設定するScriptable Itemのスクリプトの例です。
 * アイテムに対して「使う」をしたプレイヤーにPlayer Scriptのスクリプトが設定されます。
 * このアイテムにPlayer Scriptコンポーネントがアタッチされていない場合はエラーになります。
 * ```ts
 * $.onInteract((player) => {
 *   // playerに対してPlayerScriptをセットする
 *   $.setPlayerScript(player);
 * });
 * ```
 *
 * 以下は初期化時にログを出すPlayer Scriptコンポーネントのスクリプトの例です。
 * 上記のScriptable Itemと組み合わせて使うことで、プレイヤーがアイテムを使ったときにログを出します。
 * ```ts
 * // PlayerScriptがセットされた時に以下のログ表示が実行される
 * _.log("PlayerScript is initialized.");
 * _.log("Source Item ID is " + _.sourceItemId.id);
 * ```
 *
 * @example
 * 以下はメッセージで受け取ったItemIdに対して次のフレームでメッセージを送り返すPlayer Scriptコンポーネントのスクリプトの例です。
 *
 * 下記のScriptable ItemコンポーネントのスクリプトとPlayer Scriptコンポーネントのスクリプトを合わせて使うことで、ScriptableItemからPlayerScriptにメッセージを送る方法と、PlayerScriptからScriptableItemへメッセージを送る方法が確認できます。
 *
 * まずはScriptable Itemに次のスクリプトを記述します。
 *
 * ```ts
 * $.onStart(() => {
 *   // PlayerScriptを与えたプレイヤーの履歴をstateに記録する
 *   $.state.players = [];
 * });
 *
 * $.onInteract((player) => {
 *   if ($.state.players.find(p => p.id === player.id)) {
 *     // すでにPlayerScriptを与えたplayerにはメッセージを送る
 *     player.send("send", "")
 *   } else {
 *     // stateの履歴に存在しないplayerにはPlayerScriptを与えて履歴に記録する
 *     $.setPlayerScript(player);
 *     $.state.players = [...$.state.players, player]
 *   }
 *
 *   // 存在しなくなったプレイヤーを履歴から取り除く
 *   $.state.players = $.state.players.filter(p => p.exists());
 * });
 *
 * $.onReceive((messageType, arg, sender) => {
 *   if (messageType === "hello") {
 *     // "hello"メッセージを受け取ったらログに表示する
 *     $.log("hello " + arg);
 *   }
 * }, { player: true });
 * ```
 *
 * このスクリプトは次のことを行っています。
 * - このアイテムを新しく「使う」をしたユーザーにはPlayerScriptを与えます
 * - すでにPlayerScriptを与えたユーザーが「使う」をした際にはメッセージを送ります
 * - `"hello"`メッセージを受け取ったらログに表示します
 *
 * 次に以下のスクリプトをPlayer Scriptコンポーネントに記述します。
 *
 * ```ts
 * // メッセージのsenderのItemIdを格納する変数を用意する
 * let itemId = null;
 *
 * // PlayerScriptがメッセージを受け取ったときのコールバックを登録する
 * _.onReceive((messageType, arg, sender) => {
 *   switch (messageType) {
 *     case "send":
 *       if (sender instanceof ItemId) {
 *         // Itemから"send"メッセージを受け取ったらlogを表示する
 *         _.log("Received from ItemId: " + sender.id);
 *         // グローバル変数のitemIdにsenderを代入する
 *         itemId = sender;
 *       }
 *       break;
 *    }
 * });
 *
 * // PlayerScriptで毎フレーム呼ばれるコールバックを登録する
 * _.onFrame((deltaTime) => {
 *   if (itemId !== null) {
 *     // itemIdがnullでない場合、itemIdに"hello"メッセージを送ってitemIdをnullにする
 *     _.sendTo(itemId, "hello", "world");
 *     itemId = null;
 *   }
 * });
 * ```
 *
 * このスクリプトでは次のことを行っています。
 * - `"send"` というメッセージを受け取ると、その送信者のItemIdを `itemId` という変数に記録します
 * - `itemId` という変数がnullかどうかを毎フレームチェックして、nullではない場合にメッセージを送りnullを代入します
 * @player
 */
declare const _: PlayerScript;

/**
 * PlayerScriptを操作するハンドルです。`_`オブジェクトからアクセスできます。
 *
 * PlayerScriptは{@link ClusterScript.setPlayerScript | ClusterScript.setPlayerScript}で設定することで生成されます。
 * @player
 */
interface PlayerScript {
  /**
   * {@link ClusterScript.setPlayerScript | ClusterScript.setPlayerScript}を呼び出したPlayer Scriptコンポーネントを持っている元のItemの{@link ItemId | ItemId}です。
   */
  readonly sourceItemId: ItemId;

  /**
   * @beta
   * プレイヤーの{@link PlayerId | PlayerId}です。
   */
  readonly playerId: PlayerId;

  /**
   * `v`の内容を`toString`したものをログに出力します。
   *
   * @param v
   */
  log(v: any): void;

  /**
   * PlayerScriptからデータを送信するときのデータサイズを計算して、byte数を返します。
   *
   * データが{@link PlayerScriptSendable}ではない場合は{@link TypeError}が発生します。
   */
  computeSendableSize(arg: PlayerScriptSendable): number;

  /**
   * 毎フレーム呼ばれるcallbackを登録します。
   * このコールバックは毎フレーム呼ばれることが保証されています。
   *
   * 複数回呼ばれた場合、最後の登録のみが有効です。
   *
   * @example
   * ```ts
   * // 10秒間隔でログを出力する。
   * let t = 0;
   * _.onFrame(deltaTime => {
   *     t += deltaTime;
   *     if (t > 10) {
   *         _.log("10 sec elapsed.");
   *         t -= 10;
   *     }
   * });
   * ```
   *
   * @param callback
   */
  onFrame(callback: (deltaTime: number) => void): void;

  /**
   * {@link PlayerHandle.send | PlayerHandle.send}、または{@link PlayerScript.sendTo | PlayerScript.sendTo}で{@link PlayerId | PlayerId}宛てに送られたメッセージを受け取ったときに呼ばれるcallbackを登録します。
   *
   * 複数回呼ばれた場合、最後の登録のみが有効です。
   *
   * ### option
   * optionで受け取るメッセージの種類を指定できます。
   *
   * optionが未設定の場合、 {@link PlayerHandle.send | PlayerHandle.send}からのメッセージと{@link PlayerScript.sendTo | PlayerScript.sendTo}で{@link PlayerId | PlayerId}宛てに送られたメッセージの両方を受け取ります。
   *
   * - `option.item` が `true` の場合、{@link PlayerHandle.send | PlayerHandle.send} から送信されたメッセージを受け取ります。
   * - `option.item` が `false` の場合、{@link PlayerHandle.send | PlayerHandle.send} から送信されたメッセージを無視します。
   * - `option.item` が未設定の場合、{@link PlayerHandle.send | PlayerHandle.send} から送信されたメッセージを受け取ります。
   * - `option.player` が `true` の場合、{@link PlayerScript.sendTo | PlayerScript.sendTo} から送信されたメッセージを受け取ります。
   * - `option.player` が `false` の場合、{@link PlayerScript.sendTo | PlayerScript.sendTo} から送信されたメッセージを無視します。
   * - `option.player` が未設定の場合、{@link PlayerScript.sendTo | PlayerScript.sendTo} から送信されたメッセージを受け取ります。
   *
   * @example
   * ```ts
   * // 送られたメッセージをログを出力する。
   * _.onReceive((messageType, arg, sender) => {
   *   _.log(`Received message: ${messageType}, ${arg}`);
   * });
   * ```
   *
   * @example
   * ```ts
   * // 送られたメッセージをログを出力する。アイテムからのメッセージのみを受け取る。
   * _.onReceive((messageType, arg, sender) => {
   *   _.log(`Received message: ${messageType}, ${arg}`);
   * }, { player: false, item: true });
   * ```
   *
   * @param callback senderは送信元のアイテムまたはプレイヤーを表します。
   * @param option コールバックの登録のオプションです。受け取るメッセージの種類を指定できます。
   */
  onReceive(callback: (messageType: string, arg: PlayerScriptSendable, sender: ItemId | PlayerId) => void, option?: { player: boolean, item: boolean }): void;

  /**
   * アイテム・プレイヤーにメッセージを送ります。
   * 送られた対象は{@link ClusterScript.onReceive | ClusterScript.onReceive}や{@link PlayerScript.onReceive | PlayerScript.onReceive}に設定したコールバックを呼ぶことが期待されます。
   * メッセージのペイロード（`arg`引数）に使用できるデータについては{@link PlayerScriptSendable}を参照してください。
   *
   * 削除されたアイテムに対してや、無効なItemIdに対しては無視されます。
   * 退室したプレイヤーに対してや、無効なPlayerIdに対しては無視されます。
   *
   * {@link ItemId}に対して送信した場合、{@link PlayerScriptSendable}は{@link Sendable}に変換されます。
   *
   * `undefined` など、PlayerScriptSendableではない値をペイロードとして`arg`引数に渡した場合、無視されます。
   * この挙動は将来的に変更される可能性があります。
   *
   * #### 頻度の制限:
   *
   * sendToを呼び出すことができる頻度には制限があります。
   * - クラフトアイテムからの呼び出しであった場合、ひとつのアイテムあたり10回/秒以下
   * - ワールドアイテムからの呼び出しであった場合、スペース内の全てのワールドアイテムからの {@link ItemHandle.send}, {@link PlayerHandle.send}, {@link PlayerScript.sendTo} の呼び出し回数の合計が3000回/秒以下
   * 
   * 瞬間的にこの制限を超えることはできますが、平均回数はこの制限を下回るようにしてください。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * #### 流量制御:
   * 
   * このAPIを含む、流量制御の対象となるAPIがスペース内で限度を超えて頻繁に呼び出され続けた場合、結果の反映が大きく遅延することがあります。
   * 詳しくは[流量制御](https://docs.cluster.mu/creatorkit/world/cluster-script/flow-control/)を参照してください。
   * 
   * #### 流量制御による制限:
   * 
   * ワールドアイテムからの実行である場合、sendToが動作するためには、流量制御による遅延が30秒以下である必要があります。
   * 制限を超えている場合、{@link ClusterScriptError} (`rateLimitExceeded`)が発生し操作は失敗します。
   * 
   * #### 容量の制限:
   *
   * エンコードされた`arg`のデータサイズは1000byte以下である必要があります。
   * データサイズが制限を超えている場合、警告が表示されます。
   * データサイズは{@link PlayerScript.computeSendableSize}で計算できます。
   *
   * データサイズが制限を大きく超えている場合、{@link ClusterScriptError} (`requestSizeLimitExceeded`) が発生し`sendTo`は失敗します。
   * 
   * @param id 送信先のアイテムまたはプレイヤー
   * @param messageType メッセージの種別を表す100byte以下の任意の文字列
   * @param arg メッセージのペイロード
   */
  sendTo(id: PlayerId | ItemId, messageType: string, arg: PlayerScriptSendable): void;

  /**
   * プレイヤーがVRデバイスを使用して入室しているかどうかを取得します。
   */
  readonly isVr: boolean;

  /**
   * プレイヤーがデスクトップ環境で入室しているかどうかを取得します。
   *
   * VR環境やモバイル環境での入室の場合はfalseを返します。
   */
  readonly isDesktop: boolean;

  /**
   * プレイヤーがモバイル環境で入室しているかどうかを取得します。
   *
   * VR環境やデスクトップ環境での入室の場合はfalseを返します。
   */
  readonly isMobile: boolean;

  /**
   * プレイヤーがWindows環境で入室しているかどうかを取得します。
   */
  readonly isWindows: boolean;

  /**
   * プレイヤーがmacOS環境で入室しているかどうかを取得します。
   */
  readonly isMacOs: boolean;

  /**
   * プレイヤーがAndroid環境で入室しているかどうかを取得します。
   *
   * Quest環境での入室の場合はtrueを返します。
   */
  readonly isAndroid: boolean;

  /**
   * プレイヤーがiOS環境で入室しているかどうかを取得します。
   */
  readonly isIos: boolean;

  /**
   * @beta
   * アイテムのIcon Asset Listコンポーネントで定義された、`iconId`に指定したidに該当するアイコン画像オブジェクトを返します。
   * 詳細は[Icon Asset List](https://docs.cluster.mu/creatorkit/item-components/icon-asset-list/)を参照してください。
   * このアイコンは {@link PlayerScript.showButton | PlayerScript.showButton} で表示するために使用できます。
   *
   * @param iconId アイコン画像のid
   */
  iconAsset(iconId: string) : IconAsset;

  /**
   * @beta
   * 指定した整数値に対応したボタンUIを表示するか、あるいはボタンと同等に扱われるキー/マウスクリック入力等の監視を開始します。
   * 表示済みのボタンに対して呼び出した場合、必要に応じてアイコンが更新されます。
   * この方法で最大4つのボタン入力を提示できます。
   *
   * この関数でボタンを表示するには、ワールドの[WorldRuntimeSetting](https://docs.cluster.mu/creatorkit/world-components/world-runtime-setting/) コンポーネントで `Use Cluster HUD v2` オプションが有効になっている必要があります。
   * 表示したボタンのコールバックは {@link PlayerScript.onButton | PlayerScript.onButton} で登録します。
   *
   * デスクトップ環境とモバイル環境では、`index = 0`に対応するボタンは、UseItemTrigger が設定されたアイテムの「使う」ボタンと共通のボタンです。
   * それ以外のボタンは、この関数を呼び出すことでのみ表示されます。
   * `index = 0`でこの関数を呼び出した場合、 {@link PlayerScript.hideButton | PlayerScript.hideButton} を`index = 0`で呼び出すまでの間、
   * アイテムの「使う」ボタンよりも、この関数で設定したボタンの表示内容と {@link PlayerScript.onButton | PlayerScript.onButton} で登録したコールバックが優先されます。
   * ボタンを押しても UseItemTrigger は発火せず、 {@link ClusterScript.onUse | ClusterScript.onUse } も呼ばれなくなります。
   *
   * この関数で表示したボタンは {@link PlayerScript.hideButton | PlayerScript.hideButton} を呼び出すか、あるいはPlayer Scriptの有効期間が終了することで非表示になります。
   *
   * モバイル環境では、ボタンは番号に応じて特定の位置に配置されます。
   * デスクトップ環境では、ボタン0,1,2,3に対してそれぞれ以下のキーアサインが適用されます。
   *
   * - 0: 左クリック
   * - 1: 右クリック
   * - 2: Eキー
   * - 3: Rキー
   * 
   * VR環境では、ボタンを1つ以上有効にしている間に右手コントローラーのトリガーを引くことでパイメニューが表示され、スティックを倒すことでボタン入力が行えます。
   * パイメニューのボタンは、右から反時計回りに0,1,2,3に対応します。
   *
   * デスクトップ環境では、ボタンを1つ以上表示している間は画面上でカーソル操作がロックされ、カーソルロック中のクリックやキー入力がボタン入力として扱われます。
   * ボタンの表示や非表示を著しく高頻度で繰り返した場合、この自動でのカーソルロックは一定時間無効になります。
   *
   * @param index ボタンの番号で、0,1,2,3のいずれか。この範囲外の値を指定するとエラーになります
   * @param icon 表示するアイコン画像。無効なアイコンを指定した場合、アイコンが未指定なものとして扱われます。
   */
  showButton(index: number, icon: IconAsset) : void;

  /**
   * @beta
   * {@link PlayerScript.showButton | PlayerScript.showButton}で表示したボタン等を非表示にします。
   * すでに非表示のボタンに対して呼び出した場合は何も起こりません。
   *
   * デスクトップ環境とモバイル環境では、`index = 0`に対して呼び出した場合は「使う」ボタンの挙動が元に戻り、
   * UseItemTrigger や  {@link ClusterScript.onUse | ClusterScript.onUse } が設定されたアイテムを掴んでいるかどうかに基づいて、「使う」ボタンの表示/非表示が切り替わります。
   *
   * @param index ボタンの番号で、0,1,2,3のいずれか。この範囲外の値を指定するとエラーになります
   */
  hideButton(index: number) : void;

  /**
   * @beta
   * {@link PlayerScript.showButton | PlayerScript.showButton}で表示したボタンの操作時に呼ばれるコールバック関数を登録します。
   * コールバックはボタンを押し下げると `isDown = true` で呼び出され、その後にボタンを離すと `isDown = false` で呼び出されます。
   * この関数はボタンの表示状態と関係なく登録でき、ボタンを非表示にしても登録状態は保持されます。
   *
   * 複数回呼ばれた場合、ボタン番号ごとに最後の登録のみが有効です。
   *
   * このコールバックは`isDown = true`で呼ばれたあと、必ずしも`isDown = false`で呼ばれるとは限りません。
   * 例えば、ボタンを押し下げたあとで`hideButton`を呼び出してボタンを非表示にした場合、`isDown = false`でのコールバックは呼ばれません。
   *
   * @param index ボタンの番号で、0,1,2,3のいずれか。この範囲外の値を指定するとエラーになります
   * @param callback ボタンの操作時に呼ばれるcallback関数
   */
  onButton(index: number, callback: (isDown: boolean) => void): void;

  /**
   * アイテムのHumanoidAnimationListに含まれる、`humanoidAnimationId`に指定したidのアニメーションを参照する{@link HumanoidAnimation}オブジェクトを返します。
   *
   * HumanoidAnimationListの詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/item-components/humanoid-animation-list/)を参照してください。
   *
   * @param humanoidAnimationId
   */
  humanoidAnimation(humanoidAnimationId: string): HumanoidAnimation;

  /**
   * プレイヤーの現在の位置をグローバル座標で取得します。
   *
   * 値の取得に失敗した場合、nullを返します。
   *
   * プレイヤーの移動状況をより詳細に取得するには、この関数に加えて {@link PlayerScript.getAvatarMovementFlags | PlayerScript.getAvatarMovementFlags} を利用します。
   *
   * @returns プレイヤーの現在の位置
   */
  getPosition() : Vector3 | null;

  /**
   * プレイヤーの現在の方向をグローバル座標で取得します。
   *
   * 値の取得に失敗した場合、nullを返します。
   *
   * プレイヤーの移動状況をより詳細に取得するには、この関数に加えて {@link PlayerScript.getAvatarMovementFlags | PlayerScript.getAvatarMovementFlags} を利用します。
   *
   * @returns プレイヤーの現在の方向
   */
  getRotation() : Quaternion | null;

  /**
   * プレイヤーの位置をグローバル座標で設定します。
   *
   * @param position プレイヤーの位置
   */
  setPosition(position: Vector3): void;

  /**
   * プレイヤーの方向をグローバル座標で設定します。
   *
   * この関数ではy軸回転のみが適用され、プレイヤーの向きは鉛直のままになります。
   *
   * @param rotation レイヤーの方向
   */
  setRotation(rotation: Quaternion): void;

  /**
   * 指定したプレイヤーの現在の位置をグローバル座標で取得します。
   *
   * 値の取得に失敗した場合、nullを返します。
   *
   * @param playerId 取得するプレイヤーのPlayerId
   * @returns プレイヤーの現在の位置
   */
  getPositionOf(playerId: PlayerId) : Vector3 | null;

  /**
   * 指定したプレイヤーの現在の方向をグローバル座標で取得します。
   *
   * 値の取得に失敗した場合、nullを返します。
   *
   * @param playerId 取得するプレイヤーのPlayerId
   * @returns プレイヤーの現在の方向
   */
  getRotationOf(playerId: PlayerId) : Quaternion | null;

  /**
   * プレイヤーのヒューマノイドボーンの位置を取得します。
   * 値はグローバル座標です。
   * アバターのロードが完了していない場合や、アバターにボーンが存在しない場合は`null`が返されます。
   *
   * @param bone 位置を取得するボーン
   */
  getHumanoidBonePosition(bone: HumanoidBone): Vector3 | null;

  /**
   * プレイヤーのヒューマノイドボーンの回転を取得します。
   * 値はグローバル座標です。
   * アバターのロードが完了していない場合や、アバターにボーンが存在しない場合は`null`が返されます。
   *
   * @param bone 回転を取得するボーン
   */
  getHumanoidBoneRotation(bone: HumanoidBone): Quaternion | null;

  /**
   * プレイヤーのアバターモデルの姿勢を、指定したHumanoidPoseで上書きします。
   * この関数で適用した姿勢はそのフレームのみで適用され、次フレーム以降には影響しません。
   *
   * HumanoidPoseのrootPosition, rootRotation, muscleのうち、指定されていない要素については上書きされません。
   *
   * weightは指定した姿勢の適用率を0以上1以下で表し、1を指定すると姿勢が完全に適用されます。
   * weightは省略でき、省略した場合は1が指定されたものとして扱われます。
   *
   * この関数で指定した姿勢は {@link PlayerHandle.setHumanoidPose | PlayerHandle.setHumanoidPose} よりも優先されます。
   * VRではプレイヤーが掴んでいるアイテムは指定されたポーズに追従しますが、1人称のカメラやUI操作などは影響を受けません。
   *
   * @param pose このフレームで適用する姿勢
   * @param weight 姿勢の適用率
   */
  setHumanoidPoseOnFrame(pose: HumanoidPose, weight: number): void;

  /**
   * プレイヤーのアバターモデルの特定ボーンの回転を、指定した値にします。
   * 回転はグローバル回転で指定します。
   * この関数で適用したボーンの回転はそのフレームでのみ適用され、次フレーム以降には影響しません。
   *
   * アバターに存在しないボーンを指定してこの関数を呼び出した場合は、何も起こりません。
   *
   * この関数で指定したボーンの回転は、{@link PlayerHandle.setHumanoidPose | PlayerHandle.setHumanoidPose} よりも優先されます。
   * VRではプレイヤーが掴んでいるアイテムは指定されたポーズに追従しますが、1人称のカメラやUI操作などは影響を受けません。
   *
   * @param bone 回転を指定するボーン
   * @param rotation ボーンに対して設定するグローバル回転
   */
  setHumanoidBoneRotationOnFrame(bone: HumanoidBone, rotation: Quaternion): void;

  /**
   * @beta
   * カメラワークを制御するためのハンドルを取得します。
   */
  readonly cameraHandle: CameraHandle;

  /**
   * アイテムのWorldItemReferenceListに含まれる、`worldItemReferenceId`が指定されたアイテムを参照する{@link ItemId}オブジェクトを返します。
   *
   * WorldItemReferenceListの詳細は[ドキュメント](https://docs.cluster.mu/creatorkit/item-components/world-item-reference-list/)を参照してください。
   *
   * @example
   * ```ts
   * // ボタン0を使用すると指定したアイテムに "button" というメッセージを送信するアイテム
   * const target = _.worldItemReference("target");
   *
   * _.onButton(0, isDown => {
   *   if (isDown) _.sendTo(target, "button", null);
   * });
   * ```
   *
   * @param worldItemReferenceId
   */
  worldItemReference(worldItemReferenceId: string): ItemId;

  /**
   * @beta
   * レイが最初に衝突した物体を取得します。
   *
   * @param position レイの原点 (グローバル座標)
   * @param direction レイの方向 (グローバル座標)
   * @param maxDistance 衝突判定を行う最大距離
   *
   * @returns 衝突した物体 (衝突しなかった場合はnull)
   */
  raycast(position: Vector3, direction: Vector3, maxDistance: number): PlayerScriptRaycastResult | null;

  /**
   * @beta
   * レイが衝突した全ての物体を取得します。
   *
   * 大量のコライダーが範囲に含まれる場合に、条件を満たしたすべてのItemHandleを取得できない場合があります。
   * この場合、コンソールに警告メッセージが出力されます。
   *
   * @param position レイの原点 (グローバル座標)
   * @param direction レイの方向 (グローバル座標)
   * @param maxDistance 衝突判定を行う最大距離
   *
   * @returns 衝突した物体の配列 (順序は未定義)
   */
  raycastAll(position: Vector3, direction: Vector3, maxDistance: number): PlayerScriptRaycastResult[];

  /**
   * アバターの移動やモーションに関する状態を、ビットマスクされたフラグの一覧として取得します。
   * 定義されているビットフラグは以下の通りです。
   *
   * - `0x0001`: アバターが接地している場合はオン、ジャンプや落下によって空中にいる場合はオフ
   * - `0x0002`: アバターがよじのぼり動作を行っていればオン、そうでなければオフ
   * - `0x0004`: アバターが乗り物に乗っていればオン、そうでなければオフ
   *
   * フラグは今後のアップデートでも追加される可能性があるため、ビットフラグをマスクした値を使用してください。
   *
   * @example
   * ```ts
   * // ビットフラグを取得してログ出力する関数の例
   * function getStatus() {
   *   let flags = _.getAvatarMovementFlags();
   *   let isGrounded = (flags & 0x0001) !== 0;
   *   let isClimbing = (flags & 0x0002) !== 0;
   *   let isRiding = (flags & 0x0004) !== 0;
   *   _.log(`isGrounded: ${isGrounded}, isClimbing: ${isClimbing}, isRiding: ${isRiding}`);
   * }
   * ```
   *
   * @returns アバターの移動状態に関するステータス
   */
  getAvatarMovementFlags(): number;

  /**
   * プレイヤーのPlayerStorageにデータを上書き保存します。
   * 
   * 保存できるデータ（`data`引数）については{@link PlayerScriptSendable}を参照してください。
   * 
   * クラフトアイテムで実行した場合はエラーになります。
   * 
   * ### PlayerStorageとは
   * 
   * PlayerStorageは、各ワールドやイベントでプレイヤーごとに存在する、データを保存するための領域です。
   * 一度もsetPlayerStorageDataが呼ばれていないPlayerStorageには`null`が保存されています。
   * 
   * ワールドでは、プレイヤーがワールドを離れてもPlayerStorageのデータは保持されます。
   * プレイヤーが再びそのワールドに戻ると、以前のデータを参照できます。
   * PlayerStorageにはPlayerId, ItemIdを保存することもできますが、これらはスペースをまたいで有効なプレイヤーやアイテムを指し示すとは限りません。
   * 
   * イベントでは、プレイヤーがイベントに入場するたびに、PlayerStorageは初期化され、`null`がセットされます。
   * また、イベントでPlayerStorageのデータが上書きされても、イベント開催会場となった元のワールドのPlayerStorageのデータは変更されません。
   * 
   * PlayerStorageのデータはワールド管理画面から消去することができます。
   * 詳しくは[こちら](https://docs.cluster.mu/creatorkit/game/save/#ワールドのプレイ状況をリセットする)を参照してください。
   * 
   * ### 容量の制限
   * 
   * エンコードされた`data`のデータサイズは10,000byte以下である必要があります。
   * データサイズは{@link PlayerScript.computeSendableSize}で計算できます。
   * 
   * データサイズが制限を超えている場合、{@link ClusterScriptError} (`requestSizeLimitExceeded`) が発生しsetPlayerStorageDataは失敗します。
   * 
   * @example
   * ```ts
   * // レベルアップのメッセージを受け取るとレベルアップし、その結果を保存するコードの例
   * let level = 1;
   * _.onReceive((messageType, arg, sender) => {
   *   if (messageType === "levelUp") {
   *     level += 1;
   *     _.setPlayerStorageData({ level });
   *   }
   * });
   * ```
   * 
   * @param PlayerStorageに上書き保存するデータ
   */
  setPlayerStorageData(data: PlayerScriptSendable): void;

  /**
   * プレイヤーのPlayerStorageに保存されたデータを取得します。
   * 
   * クラフトアイテムで実行した場合はエラーになります。
   * 
   * PlayerStorageの詳細は{@link PlayerScript.setPlayerStorageData}を参照してください。
   * 
   * @example
   * ```ts
   * // プレイヤーのゲーム開始時に保存されたレベルを取得するコードの例
   * let level;
   * const storageData = _.getPlayerStorageData();
   * if (storageData === null) {
   *   level = 1;
   * } else {
   *   level = storageData.level;
   * }
   * ```
   * 
   * @returns PlayerStorageに現在保存されているデータ
   */
  getPlayerStorageData(): PlayerScriptSendable;

  /**
   * アイテムのPlayer Local Object Reference Listコンポーネントで定義された、`id`に指定したidに該当するオブジェクトを返します。
   * 詳細は[Player Local Object Reference List](https://docs.cluster.mu/creatorkit/item-components/player-local-object-reference-list/)を参照してください。
   * 定義されていない`id`を指定した場合や、オブジェクトは存在するもののコンポーネントで指定された条件にマッチしない場合には`null`を返します。
   * 
   * @param id オブジェクトのid
   */
  playerLocalObject(id: string): PlayerLocalObject | null;

  /**
   * @beta
   * プレイヤーをリスポーンさせます。
   */
  respawn(): void;

  /**
   * @beta
   * プレイヤーに速度を加えます。
   * プレイヤーの最終的な移動速度は、加えられた速度とプレイヤー入力の両方から決定されます。
   * プレイヤーが地面に接している間、加えられた速度は摩擦と似たような原理で減速し続けます。
   *
   * @param velocity 加えられる速度 (グローバル座標)
   */
  addVelocity(velocity: Vector3): void;

  /**
   * @beta
   * プレイヤーの移動速度の倍率を変更します。初期値は1です。
   *
   * {@link PlayerHandle.setMoveSpeedRate | PlayerHandle.setMoveSpeedRate}と設定を共有します。
   * あとから呼び出した方の値で上書きされます。
   *
   * @param moveSpeedRate 移動速度の倍率
   */
  setMoveSpeedRate(moveSpeedRate: number): void

  /**
   * @beta
   * プレイヤーのジャンプ速度の倍率を変更します。初期値は1です。
   *
   * {@link PlayerHandle.setJumpSpeedRate | PlayerHandle.setJumpSpeedRate}と設定を共有します。
   * あとから呼び出した方の値で上書きされます。
   *
   * @param jumpSpeedRate ジャンプ速度の倍率
   */
  setJumpSpeedRate(jumpSpeedRate: number): void

  /**
   * @beta
   * プレイヤーにかかる重力加速度（単位：m/s^2）を変更します。初期値は-9.81です。
   *
   * {@link PlayerHandle.setGravity | PlayerHandle.setGravity}と設定を共有します。
   * あとから呼び出した方の値で上書きされます。
   *
   * @param gravity 重力加速度
   */
  setGravity(gravity: number): void

  /**
   * @beta
   * プレイヤーに設定された移動速度、ジャンプ速度、重力をリセットします。
   * {@link PlayerHandle}で指定された移動速度、ジャンプ速度、重力もリセットされます。
   */
  resetPlayerEffects(): void

  /**
   * @beta
   * プレイヤーにポストプロセスエフェクトを設定します。
   *
   * このメソッドを呼び出すたびに、以前設定されていたPostProcessEffectsは新しいPostProcessEffectsで上書きされます。
   *
   * nullを設定するとすべてのエフェクトがクリアされます。
   *
   * {@link PlayerHandle.setPostProcessEffects | PlayerHandle.setPostProcessEffects}と設定を共有します。
   * あとから呼び出した方の値で上書きされます。
   *
   * @example
   * ```ts
   * // 押すととてもまぶしくなるボタン
   * _.onButton(0, (isDown) => {
   *     if (!isDown) return;
   *     const effects = new PostProcessEffects();
   *     effects.bloom.active = true;
   *     effects.bloom.threshold.setValue(0.5);
   *     effects.bloom.intensity.setValue(10.0);
   *     _.setPostProcessEffects(effects);
   * });
   * ```
   *
   * @param effects PostProcessEffectsのインスタンス。
   */
  setPostProcessEffects(effects: PostProcessEffects | null): void

  /**
   * @beta
   * プレイヤーの[ユーザーID](https://help.cluster.mu/hc/ja/articles/115000821651-%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BCID)です。
   * ユーザーは自分のユーザーIDを変更することができますが、
   * 異なるユーザーが同じユーザーIDを同時にもつことはありません。
   * 退室したプレイヤーに対してや、無効なPlayerIdに対してはnullを返します。
   *
   * @param playerId 取得するプレイヤーのPlayerId
   */
  getUserId(playerId: PlayerId): string | null;

  /**
   * @beta
   * プレイヤーの[表示名](https://help.cluster.mu/hc/ja/articles/115000827152-%E8%A1%A8%E7%A4%BA%E5%90%8D)を取得します。
   * ユーザーは自分の表示名を変更することができ、異なるユーザーが同じ表示名を使うことができます。
   * 退室したプレイヤーに対してや、無効なPlayerIdに対してはnullを返します。
   *
   * @param playerId 取得するプレイヤーのPlayerId
   */
  getUserDisplayName(playerId: PlayerId): string | null;

  /**
   * @beta
   * [IDFC](https://docs.cluster.mu/creatorkit/world/manage-data/#idfc-identifier-for-creator)を取得します。
   * IDFCはクリエイターがユーザーを一意に認識するために利用できる文字列です。
   * この文字列は32文字で、使われる文字は `0123456789abcdef` です。
   * この文字列はPlayerScriptの元となるアイテムをアップロードしたアカウントとユーザーのアカウントとの組によって決定されます。
   * 元となるアイテムとは、 `$.setPlayerScript()` を呼び出したアイテムのことで、 `_.sourceItemId` で取得できるアイテムとなります。
   * ユーザーの使用するデバイスやスペースによっては変化しません。
   * 退室したプレイヤーに対してや、無効なPlayerIdに対してはnullを返します。
   *
   * この文字列はコンテンツ体験を向上する目的で利用できます。当社が不適切と判断した場合、予告なく利用を制限させていただく場合もあります。
   *
   * @param playerId 取得するプレイヤーのPlayerId
   */
  getIdfc(playerId: PlayerId): string | null;

  /**
   * Open Sound Control (OSC)の受信を行うためのハンドルです。
   */
  readonly oscHandle: OscHandle;

  /**
   * プレイヤーが現在使用しているアバター商品の商品IDを取得します。
   *
   * 使用しているアバターが商品でない場合は `null` を返します。\
   * プレイヤーがアバターメイカーを起動している間は、アバターメイカー起動前に使用していたアバターの商品IDを返します。\
   * プレイヤーがアバターを変更した直後は、直前に使用していたアバターの商品IDを返すことがあります。\
   * プレイヤーが入場した直後は `null` を返すことがあります。\
   * プレイヤーが存在しないとき、`null` を返します。プレイヤーの存在は{@link PlayerHandle.exists}で確認できます。
   *
   * @returns プレイヤーが現在使用しているアバターの商品ID。
   */
  getAvatarProductId(): string | null;

  /**
   * プレイヤーが現在使用しているアクセサリー商品の商品IDの配列を取得します。
   *
   * 使用しているアクセサリーが商品でない場合は配列に含まれません。\
   * プレイヤーがアクセサリーを編集している間は、アクセサリー編集前に使用していたアクセサリーの商品IDを返します。\
   * プレイヤーがアクセサリーを保存した直後は、直前に使用していたアクセサリーの商品IDを返すことがあります。\
   * プレイヤーが入場した直後は空の配列を返すことがあります。\
   * プレイヤーが存在しないとき、空の配列を返します。プレイヤーの存在は{@link PlayerHandle.exists}で確認できます。
   *
   * @returns プレイヤーが現在使用しているアクセサリーの商品IDの配列。
   */
  getAccessoryProductIds(): string[];

  /**
   * 指定したプレイヤーのボイスが、このPlayerScriptを実行するプレイヤーに対して聞こえる音量を変更します。
   * 自分自身への設定は無視されます。
   *
   * この設定はPlayer Scriptの有効期間が終了した場合にリセットされます。
   *
   * @param playerId 設定するプレイヤーのPlayerId。
   * @param rate 設定する音量の割合。0以上、1以下の値が指定できます。範囲外の値を指定した場合、範囲内の値に丸められます。
   */
  setVoiceVolumeRateOf(playerId: PlayerId, rate: number): void;
}

/**
 * プレイヤーのカメラワークを制御するハンドルです。
 * {@link PlayerScript.cameraHandle | PlayerScript.cameraHandle}で取得することができます。
 * @player @beta
 */
interface CameraHandle {

  /**
   * @beta
   * プレイヤーが現在選択している視点が一人称視点であるかどうかを取得します。
   *
   * VR環境のプレイヤーに対して呼び出した場合、つねに`true`が返ります。
   * VR環境ではないプレイヤーに対して呼び出した場合、現在そのプレイヤーが選んでいる視点が1人称視点ならば`true`、そうでなければ`false`を返します。
   *
   * この関数の結果は、カメラが特殊なモードになっていても有効な値を返します。
   * 視点が有効であるかどうかを検証する場合、 {@link CameraHandle.getPosition | CameraHandle.getPosition} あるいは {@link CameraHandle.getRotation | CameraHandle.getRotation} を呼び出した結果が`null`でないことを確認します。
   *
   * @returns プレイヤーが現在選択している視点が一人称視点かどうか
   */
  isFirstPersonView(): boolean;

  /**
   * @beta
   * 現在のカメラ位置をグローバル座標で取得します。
   * VR環境の場合、プレイヤーの1人称視点の位置を取得します。
   * VR環境ではない場合、1人称視点/3人称視点の選択状態に基づいたカメラ位置を取得します。
   *
   * VR環境以外でプレイヤーがアクセサリー編集を行っている場合、この関数ではアクセサリー編集中のカメラ位置は取得せず、
   * アクセサリー編集の終了後に適用予定のカメラ位置を取得します。
   */
  getPosition(): Vector3;

  /**
   * @beta
   * 現在のカメラ回転をグローバル座標で取得します。
   * VR環境の場合、プレイヤーの1人称視点の回転を取得します。
   * VR環境ではない場合、1人称視点/3人称視点の選択状態に基づいたカメラ回転を取得します。
   *
   * VR環境以外でプレイヤーがアクセサリー編集を行っている場合、この関数ではアクセサリー編集中のカメラ回転は取得せず、
   * アクセサリー編集の終了後に適用予定のカメラ回転を取得します。
   */
  getRotation(): Quaternion;

  /**
   * @beta
   * カメラ位置をグローバル座標で指定します。
   * 
   * この関数を呼び出したときの挙動は以下の通りです。
   * - VR環境の場合
   *   - VR環境でのカメラ位置には影響しません
   * - VR環境でない場合
   *   - この関数を呼び出す直前に1人称視点であった場合は、3人称視点のカメラに切り替わります
   *   - 指定したカメラ位置が反映されます
   *   - 1人称視点/3人称視点の切り替え操作を無効化します
   *   - アバターの頭はカメラモードのカメラ目線をオンにした場合を除いて、常に進行方向を向くようになります
   *   - アバターの描画品質は指定したカメラ位置からの距離に応じて変化するようになります
   *     - ただし、プレイヤーから大きく離れたアバターのモーションや音声の品質が低下することがあります
   *   - 以下の項目は通常の3人称視点の場合と同じになります
   *     - アバターの移動操作方法
   *     - プレイヤーの声の発生源
   *     - 音の聞こえ方
   *     - アイテムの選択方法
   * - その他の特殊なモード（アクセサリー編集中など）の場合
   *   - カメラ位置を指定できますが即座には反映されず、特殊なモードが終了後に反映されます
   *
   * この関数で指定した値は`position`に`null`を指定して呼び出すか、またはPlayer Scriptの有効期間が終了した場合にリセットされます。
   * リセットされた後は1人称視点/3人称視点の切り替え操作が再び有効になります。
   * また、この関数を呼び出す前に1人称視点であった場合は、リセット後に1人称視点に戻ります。
   *
   * @param position カメラのグローバル座標。
   */
  setPosition(position: Vector3 | null): void;

  /**
   * @beta
   * カメラ回転をグローバル回転で指定します。
   * 
   * この関数を呼び出したときの挙動は以下の通りです。
   * - VR環境の場合
   *   - VR環境でのカメラ回転には影響しません
   * - VR環境でない1人称視点の場合
   *   - 指定したカメラ回転が反映されます
   *   - マウスのドラッグ操作でのカメラ回転が無効化されます
   *   - カメラの回転には影響しません
   * - VR環境でない3人称視点の場合
   *   - 指定したカメラ回転が反映されます
   *   - マウスのドラッグ操作でのカメラ回転が無効化されます
   *   - カメラの回転とプレイヤーの位置に合わせてカメラの位置が変更されます
   * - その他の特殊なモード（アクセサリー編集中など）の場合
   *   - カメラ回転を指定できますが即座には反映されず、特殊なモードが終了後に反映されます
   * 
   * この関数で`rotation`に`null`を指定して呼び出すか、またはPlayer Scriptの有効期間が終了した場合、プレイヤーがカメラ回転を操作できる状態に戻ります。
   * このときのカメラ回転は、最後に`setRotation()`で指定していた回転からロール角成分を除去した値になります。
   *
   * @param rotation カメラのグローバル回転。
   */
  setRotation(rotation: Quaternion | null): void;

  /**
   * @beta
   * `setPosition()` と `setRotation()` によるカメラ姿勢の操作を行っていない状態に相当するカメラ位置を計算します。
   * 
   * VR環境の場合、`rotation` や `isFirstPersonView` の値を無視し、 `getPosition()` と同じ値を返します。
   * VR環境ではない場合、`rotation` と `isFirstPersonView` の値に基づいたカメラの回転および視点に対応するカメラ位置を返します。
   * 
   * @param rotation カメラのグローバル回転。ただし、ロール角成分は無視されます。
   * @param isFirstPersonView 1人称視点の場合は`true`、3人称視点の場合は`false`。
   */
  calculateDefaultPosition(rotation: Quaternion, isFirstPersonView: boolean): Vector3;

  /**
   * @beta
   * VR環境ではないプレイヤーに対して、視野角(Field of View)のデフォルト値を設定します。
   * 視野角は画面の下端から上端までの、垂直方向の角度として指定します。
   *
   * VR環境に対しても呼び出せますが、VR環境での視野角には影響しません。
   * この方法で視野角を変更したあとも、プレイヤーは引き続きズームイン/ズームアウト操作や、ズームによる1人称/3人称視点の切り替え操作を行えます。
   *
   * この関数で指定した値は`value`に`null`を指定して呼び出すか、またはPlayer Scriptの有効期間が終了した場合にリセットされます。
   *
   * @param value 視野角のデフォルト値(degree)。10以上、80以下の値が指定できます。範囲外の値を指定した場合、範囲内の値に丸められます。
   * @param immediate `true`にすると、補間を行わず、直ちに値を適用します。この値は省略可能で、省略すると`false`相当に扱われます
   */
  setFieldOfView(value: number | null, immediate: boolean): void;

  /**
   * @beta
   * 3人称視点のときにアバターとカメラが取りうる最大の距離をメートル単位で指定します。
   *
   * カメラとアバターの距離は必ずしも指定した値にはなりません。
   * アバターの周辺に壁や天井がある場合、指定した距離よりもアバターとカメラは近づく場合があります。
   *
   * この関数はプレイヤーがVR環境や1人称視点の状態でも実行できますが、VR環境や1人称視点のときの挙動には影響しません。
   *
   * この関数で指定した値は`distance`に`null`を指定して呼び出すか、またはPlayer Scriptの有効期間が終了した場合にリセットされます。
   *
   * @param distance アバターとカメラの距離の最大値。最小値は0.2で、これよも小さい値を指定した場合は0.2を指定したのと同様に扱われます。
   * @param immediate `true`にすると、補間を行わず、直ちに距離を適用します。この値は省略可能で、省略すると`false`相当に扱われます
   */
  setThirdPersonDistance(distance: number | null, immediate: boolean): void;

  /**
   * @beta
   * 3人称視点のとき、アバターの頭部付近が画面上で映る位置を、スクリーン座標で指定します。
   * 画面の左端が`x=0`、右端が`x=1`に対応します。
   * 画面の下端が`y=0`、上端が`y=1`に対応します。
   *
   * この関数はプレイヤーがVR環境や1人称視点の状態でも実行できますが、VR環境や1人称視点のときの挙動には影響しません。
   *
   * この関数で指定した値は`pos`に`null`を指定して呼び出すか、またはPlayer Scriptの有効期間が終了した場合にリセットされます。
   *
   * @param pos アバターの頭部付近が画面上に映る位置。x, yいずれの成分も0以上1以下の範囲に丸められます。
   * @param immediate `true`にすると、補間を行わず、直ちに値を適用します。この値は省略可能で、省略すると`false`相当に扱われます
   */
  setThirdPersonAvatarScreenPosition(pos: Vector2 | null, immediate: boolean): void;

  /**
   * @beta
   * 3人称視点のとき、アバターが正面方向に向くよう姿勢を固定するかどうかを設定します。
   * 照準しながら使うようなアイテムを持っている場合にこの関数を呼び出すことで、3人称視点での挙動を最適化できます。
   *
   * この関数はプレイヤーがVR環境や1人称視点の状態でも実行できますが、VR環境や1人称視点のときの挙動には影響しません。
   *
   * この関数で指定した値は`value`に`null`を指定して呼び出すか、またはPlayer Scriptの有効期間が終了した場合にリセットされます。
   *
   * @param value アバターの向きを正面方向に固定するかどうか
   */
  setThirdPersonAvatarForwardLock(value: boolean | null): void;

}

/**
 * PlayerScriptから扱えるアイテムの参照です。
 * {@link PlayerHandle.send | PlayerHandle.send} で送られたメッセージを受け取る際、ItemHandleはItemIdに変換されます。
 * @player
 */
declare class ItemId {
  /** @internal */
  private constructor();

  /**
   * 空間内のアイテムを一意に表すIDの文字列表現です。
   * idが等しいItemIdは同一のアイテムを指し示します。
   * {@link ItemHandle.id | ItemHandle.id} の値と同じです。
   */
  readonly id: string;

  /**
   * 文字列 "item" を返します。
   * この値は {@link ItemId} と {@link PlayerId} を区別するために利用できます。 
   */
  readonly type: "item";
}

/**
 * PlayerScriptから扱えるプレイヤーの参照です。
 * {@link PlayerHandle.send | PlayerHandle.send} で送られたメッセージを受け取る際、PlayerHandleはPlayerIdに変換されます。
 * @player 
 */
declare class PlayerId {
  /** @internal */
  private constructor();

  /**
   * 空間内のプレイヤーを一意に表すIDの文字列表現です。
   * idが等しいPlayerIdは同一のプレイヤーを指し示します。
   * この値は同じユーザーでも入室ごとに異なります。
   * {@link PlayerHandle.id | PlayerHandle.id} の値と同じです。
   */
  readonly id: string;

  /**
   * 文字列 "player" を返します。
   * この値は {@link ItemId} と {@link PlayerId} を区別するために利用できます。 
   */
  readonly type: "player";
}

/**
 * {@link PlayerScript.iconAsset | PlayerScript.iconAsset} で取得できるアイコン画像を指す値です。
 * {@link PlayerScript.showButton | PlayerScript.showButton} を用いてボタンにアイコンを表示するときに利用します。
 * @player @beta
 */
interface IconAsset {
}

/**
 * Raycastの結果を表す、readonlyな型です。
 * {@link PlayerScript | PlayerScript }の機能でレイキャストを行った場合にこの結果が返されます。
 *
 * {@link RaycastResult | RaycastResult }との違いとして、当たった対象の詳細情報を含まないことに注意して下さい。
 * @player @beta
 */
interface PlayerScriptRaycastResult {
  /**
   * @beta
   * 当たりの情報を表します。
   */
  readonly hit: Hit;
}

/**
 * ワールド内商品購入の結果を示すステータスコードです。{@link PlayerHandle.requestPurchase | PlayerHandle.requestPurchase}、{@link ClusterScript.onRequestPurchaseStatus | ClusterScript.onRequestPurchaseStatus}を参照してください。
 * @item
 */
declare enum PurchaseRequestStatus {
  /** ネットワークエラーなどの理由で、購入が行われたかどうかが判定できないことを示します。 */
  Unknown = 0,
  /** プレイヤーが商品を購入したことを示します。 */
  Purchased = 1,
  /** プレイヤーが商品購入ダイアログを表示できない状態のため、商品購入リクエストが自動的に拒否されたことを示します。 */
  Busy = 2,
  /** プレイヤーが商品を購入せずに商品購入ダイアログを閉じたことを意味します。 */
  UserCanceled = 3,
  /** 指定した商品が利用できないため、購入ダイアログの表示に失敗したことを示します。 */
  NotAvailable = 4,
  /** プレイヤーが商品を購入しようとしたが、購入に失敗したことを示します。 */
  Failed = 5,
}

/**
 * ワールド内商品の所持状況を表現する値です。
 * {@link ClusterScript.getOwnProducts | ClusterScript.getOwnProducts}、{@link ClusterScript.onGetOwnProducts | ClusterScript.onGetOwnProducts}を参照してください。
 * @item
 */
interface OwnProduct {
  /**
   * 所持しているワールド内商品の商品IDです。
   */
  readonly productId: string;
  /**
   * ワールド内商品を所持しているプレイヤーです。
   */
  readonly player: PlayerHandle;
  /**
   * プレイヤーがこのワールド内商品を購入した累計の個数です。
   */
  readonly plusAmount: number;
  /**
   * プレイヤーが購入したワールド内商品について返金を受けた累計の個数です。
   */
  readonly minusAmount: number;
}

/**
 * @player
 * Player Scriptで参照可能なオブジェクトを操作するハンドルです。
 */
interface PlayerLocalObject {

  /**
   * オブジェクトの名前を指定して、このオブジェクトの子要素のオブジェクトを取得します。
   * 
   * この関数では `Item` コンポーネントがアタッチされたオブジェクト、およびその子要素は取得できません。
   * `Item` コンポーネントがアタッチされたオブジェクトをスクリプトから制御する場合、 {@link ClusterScript | ClusterScript } や {@link SubNode | SubNode } を使用してください。
   * 
   * @param name 
   * @returns 指定したnameに対応するオブジェクトがあればそのオブジェクト、なければ`null`
   */
  findObject(name: string): PlayerLocalObject | null;

  /**
   * このオブジェクトの名前です。
   */
  readonly name: string;

  /**
   * オブジェクトの有効状態を変更します。
   * オブジェクトを無効にした場合、このオブジェクト、および全ての子のオブジェクトが無効となり、描画されなくなります。
   * 
   * この関数は `Item` を親要素または子要素に含むオブジェクトに対して呼び出した場合、例外になります。
   * これは `Item` のコンポーネントや `Scriptable Item` のスクリプトとの制御の競合を防ぐための制限事項です。
   * 
   * @param v 有効ならtrue
   */
  setEnabled(v: boolean): void;

  /**
   * このオブジェクトの現在の有効状態を取得します。
   *
   * 値の取得に失敗した場合、`null` を返します。
   *
   */
  getEnabled(): boolean;

  /**
   * オブジェクトが有効かどうかを取得します。
   * このオブジェクトと全ての親オブジェクトが有効である場合は`true`を返します。
   * 
   * 値の取得に失敗した場合、`null` を返します。
   *
   */
  getTotalEnabled(): boolean;

  /**
   * このオブジェクトにアタッチされたUnityコンポーネントのハンドルを、型名を指定して取得します。
   * `type`として指定できるコンポーネント名については {@link UnityComponent} の説明を参照してください。
   * 
   * 同じコンポーネントが複数アタッチされている場合、最初に見つかったコンポーネントのハンドルを返します。
   * 
   * この関数は `Item` を親要素または子要素に含むオブジェクトに対して呼び出した場合、例外になります。
   * これは `Item` のコンポーネントや `Scriptable Item` のスクリプトとの制御の競合を防ぐための制限事項です。
   * 
   * @param type 
   * @returns 指定したコンポーネントが存在すればそのコンポーネントのハンドル、なければ`null`
   */
  getUnityComponent(type: string) : UnityComponent | null;
}

/**
 * オブジェクトにアタッチされたUnityコンポーネントを操作するためのハンドルです。
 * 
 * このハンドルは下記の関数で取得できます。
 * 
 * - {@link ClusterScript.getUnityComponent | ClusterScript.getUnityComponent}
 * - {@link SubNode.getUnityComponent | SubNode.getUnityComponent}
 * - {@link PlayerLocalObject.getUnityComponent | PlayerLocalObject.getUnityComponent}
 * 
 * {@link ClusterScript.getUnityComponent | ClusterScript.getUnityComponent} または {@link SubNode.getUnityComponent | SubNode.getUnityComponent} で取得した `UnityComponent` への操作は、アイテムの見た目や振る舞いを変更します。この変更はどのプレイヤーからも見る事ができます。
 * 
 * {@link PlayerLocalObject.getUnityComponent | PlayerLocalObject.getUnityComponent} で取得した `UnityComponent` への操作は、そのプレイヤーから見たコンポーネントの見た目や振る舞いを変更します。
 * 
 * いずれの関数でも、`type`としては特定のコンポーネント名のみが指定できます。
 * 以下はサポートされているコンポーネント名の一覧です。
 * 
 * - "Animator"
 * - "AudioSource"
 * - "Button"
 * - "Camera"
 * - "Canvas"
 * - "CanvasGroup"
 * - "BoxCollider"
 * - "CapsuleCollider"
 * - "GridLayoutGroup"
 * - "HorizontalLayoutGroup"
 * - "Image"
 * - "MeshCollider"
 * - "MeshRenderer"
 * - "ParticleSystem"
 * - "PlayableDirector"
 * - "PositionConstraint"
 * - "PostProcessVolume"
 * - "RawImage"
 * - "RectTransform"
 * - "Rigidbody"
 * - "RotationConstraint"
 * - "ScaleConstraint"
 * - "SkinnedMeshRenderer" 
 * - "SphereCollider"
 * - "Text"
 * - "Transform"
 * - "VerticalLayoutGroup"
 * - "VideoPlayer"
 * 
 */
interface UnityComponent { 

  /**
   * Unityコンポーネントのプロパティを取得、または設定するためのハンドルを取得します。
   * 
   * このハンドルからプロパティを指定する場合、Unity C# でアクセス可能なコンポーネントのプロパティ名そのものを指定する必要があります。
   * Unity Editor のインスペクターで表示される名称と実際のプロパティ名は異なる場合があることに注意してください。
   * 詳しくはUnityのAPIリファレンス等を参照してください。
   *  
   * `unityProp` でアクセスできるプロパティは、データ型が `bool`, `int`, `float`, `double`, `string`, `Vector2`, `Vector3`, `Vector4`, `Quaternion`, `Color`, または `Enum` の派生型のいずれかである必要があります。
   * それ以外のデータ型のプロパティでは取得を試みると `null` が返り、値を設定しようとすると例外になります。
   * 
   * `Enum` の派生型のデータを取得した場合、値に対応する `int` が返ります。
   * 同様に、`Enum` の派生型のデータを設定する場合、対応する `int` の値を指定します。
   * `Enum` のそれぞれの値と内部的な `int` の値の対応については、UnityのAPIリファレンス等を参照してください。
   * 
   * `Player Script` では、この方法で更新したプロパティはスクリプトを実行中のプレイヤーにのみ反映されます。
   * 
   * `Scriptable Item` では、この方法で指定したプロパティの値はネットワークを介して同期されます。同期は即座に反映されない場合があること、および値に補間処理は適用されない事に注意してください。
   * 
   * @example
   * ```ts
   * // Scriptable Item で SubNode のコンポーネントのプロパティにアクセスする例
   * let node = $.subNode("Cube");
   * let meshRenderer = node.getUnityComponent("MeshRenderer");
   * meshRenderer.unityProp.receiveShadows = false;
   * 
   * let transform = node.getUnityComponent("Transform");
   * transform.unityProp.localScale = new Vector3(2, 2, 2);
   * ```
   * 
   * @example
   * ```ts
   * // Player Script で PlayerLocalObject のコンポーネントのプロパティにアクセスする例
   * let imageObject = _.playerLocalObject("ImageObject");
   * let image = imageObject.getUnityComponent("Image");
   * image.unityProp.color = new Color(1, 0, 0, 1);
   * 
   * let textObject = _.playerLocalObject("TextObject");
   * let textComponent = textObject.getUnityComponent("Text");
   * textComponent.unityProp.text = "Hello, World!";
   * ```
   * 
   * `Scriptable Item` では、このAPIとそれ以外の方法で同一のプロパティを更新すると挙動が未定義になります。
   * このAPIと Animator 等で共通のプロパティを制御した場合の挙動は未定義です。
   * また、 {@link SubNode.setPosition | SubNode.setPosition } 等は内部的に `Transform.localPosition` を更新する処理であるため、
   * このAPIでの `Transform.localPosition` の変更と {@link SubNode.setPosition | SubNode.setPosition } を併用した場合も挙動は未定義です。
   * 
   * 上述の未定義挙動を避けるため、`Scriptable Item` では以下のことに注意してください。
   * 
   * - このAPIで更新するプロパティは、Animator等からは制御しないようにする
   * - このAPI以外のAPIで更新できる値については、そのAPIから操作することを検討する
   * 
   * 例えば、アイテムの位置を変更する場合はこのAPIではなく {@link ClusterScript.setPosition | ClusterScript.setPosition} の使用を検討してください。
   * 
   * 
   * また、 `Scriptable Item` では、プロパティをプレイヤー間で同期できるようにするため、編集可能なプロパティが制限されています。
   * 各コンポーネントの `enabled` プロパティ、およびコンポーネントに応じた下記のプロパティが取得、設定できます。
   * 
   * - AudioSource
   *   - bypassEffects
   *   - bypassListenerEffects
   *   - bypassReverbZones
   *   - dopplerLevel
   *   - loop
   *   - maxDistance
   *   - minDistance
   *   - mute
   *   - panStereo
   *   - pitch
   *   - playOnAwake
   *   - priority
   *   - spatialize
   *   - spatializePostEffects
   * - BoxCollider
   *   - center
   *   - isTrigger
   *   - size
   * - Button
   *   - interactable
   *   - transition
   * - Camera
   *   - allowMSAA
   *   - backgroundColor
   *   - depth
   *   - farClipPlane
   *   - fieldOfView
   *   - focalLength
   *   - forceIntoRenderTexture
   *   - allowHDR
   *   - lensShift
   *   - nearClipPlane
   *   - useOcclusionCulling
   *   - orthographic
   *   - orthographicSize
   *   - stereoConvergence
   *   - stereoSeparation
   * - Canvas
   *   - overridePixelPerfect
   *   - overrideSorting
   *   - pixelPerfect
   *   - planeDistance
   *   - normalizedSortingGridSize
   * - CanvasGroup
   *   - alpha
   *   - blocksRaycasts
   *   - ignoreParentGroups
   *   - interactable
   * - CapsuleCollider
   *   - center
   *   - height
   *   - isTrigger
   *   - radius
   * - GridLayoutGroup
   *   - cellSize
   *   - childAlignment
   *   - constraint
   *   - constraintCount
   *   - spacing
   *   - startAxis
   *   - startCorner
   * - HorizontalLayoutGroup
   *   - childAlignment
   *   - childControlHeight
   *   - childControlWidth
   *   - childForceExpandHeight
   *   - childForceExpandWidth
   *   - childScaleHeight
   *   - childScaleWidth
   *   - reverseArrangement
   *   - spacing
   * - Image
   *   - color
   *   - fillAmount
   *   - fillCenter
   *   - fillClockwise
   *   - fillMethod
   *   - fillOrigin
   *   - maskable
   *   - pixelsPerUnitMultiplier
   *   - preserveAspect
   *   - raycastPadding
   *   - raycastTarget
   *   - type
   *   - useSpriteMesh
   * - MeshCollider
   *   - convex
   *   - isTrigger
   * - MeshRenderer
   *   - receiveShadows
   *   - rendererPriority
   *   - sortingOrder
   * - PositionConstraint
   *   - constraintActive
   *   - translationAxis
   *   - translationAtRest
   *   - translationOffset
   *   - weight
   * - PostProcessVolume
   *   - blendDistance
   *   - isGlobal
   *   - priority
   *   - weight 
   * - RawImage
   *   - color
   *   - maskable
   *   - raycastPadding
   *   - raycastTarget
   * - RectTransform
   *   - anchorMax
   *   - anchorMin
   *   - anchoredPosition
   *   - pivot
   *   - localPosition
   *   - localScale
   *   - sizeDelta
   * - Rigidbody
   *   - angularDrag
   *   - drag
   *   - isKinematic
   *   - mass
   *   - useGravity
   * - RotationConstraint
   *   - constraintActive
   *   - rotationAxis
   *   - rotationAtRest
   *   - rotationOffset
   *   - weight
   * - ScaleConstraint
   *   - constraintActive
   *   - scalingAxis
   *   - scaleAtRest
   *   - scaleOffset
   *   - weight
   * - SkinnedMeshRenderer
   *   - receiveShadows
   *   - rendererPriority
   *   - skinnedMotionVectors
   *   - sortingOrder
   *   - updateWhenOffscreen
   * - SphereCollider
   *   - center
   *   - isTrigger
   *   - radius
   * - Text
   *   - text
   *   - color
   *   - maskable
   *   - raycastPadding
   *   - raycastTarget
   * - Transform
   *   - localPosition
   *   - localRotation
   *   - localScale
   * - VerticalLayoutGroup
   *   - childAlignment
   *   - childControlHeight
   *   - childControlWidth
   *   - childForceExpandHeight
   *   - childForceExpandWidth
   *   - childScaleHeight
   *   - childScaleWidth
   *   - reverseArrangement
   *   - spacing
   * - VideoPlayer
   *   - sendFrameReadyEvents
   *   - isLooping
   *   - playOnAwake
   *   - playbackSpeed
   *   - skipOnDrop
   *   - targetCameraAlpha
   *   - waitForFirstFrame
   * 
   */
  readonly unityProp : UnityComponentPropertyProxy;

  /** 
   * @beta
   * このハンドルが操作対象とするコンポーネントが `PlayableDirector`, `AudioSource`, `ParticleSystem`, `VideoPlayer` のいずれかであれば、それらの再生を開始します。
   * それ以外のコンポーネントに対して呼び出した場合、例外になります。
   * 
   * {@link ClusterScript.getUnityComponent | ClusterScript.getUnityComponent} または {@link SubNode.getUnityComponent | SubNode.getUnityComponent} で取得したコンポーネントに対してこの関数を呼び出した場合、
   * `PlayableDirector`, `AudioSource` では、どのプレイヤーから見ても `play()` が実行された時刻から再生を開始したように見えます。 
   * 冒頭部分の再生はスキップされる場合があります。
   * 
   * すでに `play()` した状態のままこの関数を呼び出した場合、再生を停止し、再度再生します。
   * 
   * `ParticleSystem` に対してこの関数を呼び出すと、呼び出した `ParticleSystem` に加えて子要素に含まれるパーティクルも再生されます。
   * 親要素と子要素がいずれも `ParticleSystem` を持つ場合、親要素のパーティクルのみで `play()` や `stop()` を実行して下さい。
   * 親子関係にある `ParticleSystem` の複数を  `play()` したり `stop()` したりすると正しく再生されない場合があります。
   * 
   * `VideoPlayer` でこの関数を使う場合、`Source` に `Video Clip` を指定し、`Render Mode` は `Material Override` にすることを推奨しています。
   * `Source` が `Video Clip` になっている `VideoPlayer` では、どのプレイヤーからみても `play()` が実行された時刻から再生を開始したように見えます。
   * ただし冒頭部分の再生はスキップされる場合があります。また、動画のサイズやエンコード方法によっては再生開始までに時間がかかる場合があります。
   * 
   * `Source` に `URL` を指定した場合、 `play()` を呼び出してから実際に再生を開始するまでに大きな遅延が発生します。また、プレイヤーごとに再生の開始タイミングや再生時刻が一致しなくなります。
   * 
   * `VideoPlayer` の描画結果を `Render Texture` に表示する場合、再生を行っていないときの描画状態はOSやテクスチャの設定によって変化します。
   * `VideoPlayer` の再生中以外はテクスチャを非表示にすることを検討してください。
   * 
   */
  play(): void;

  /** 
   * @beta
   * このハンドルが操作対象とするコンポーネントが `PlayableDirector`, `AudioSource`, `ParticleSystem`, `VideoPlayer` のいずれかであれば、それらの再生を停止します。
   * それ以外のコンポーネントに対して呼び出した場合、例外になります。
   * `PlayableDirector`, `VideoPlayer` に対してこの関数を呼び出すと、再生を停止するとともに、再生時刻が初期状態にリセットされます。
   * 
   * `ParticleSystem` に対してこの関数を呼び出すと、呼び出した `ParticleSystem` に加えて子要素に含まれるパーティクルも停止します。
   * 親要素と子要素がいずれも `ParticleSystem` を持つ場合、親要素のパーティクルのみで `play()` や `stop()` を実行して下さい。
   * 親要素と子要素のパーティクルを同時に `play()` したり `stop()` したりすると正しく再生されない場合があります。
   * 
   */
  stop(): void;

  /**
   * @beta
   * このハンドルが操作対象とするコンポーネントが `Animator` である場合、その `Animator` のTriggerをセットします。
   * それ以外のコンポーネントに対して呼び出した場合、例外になります。
   * 
   * 存在しないパラメーターを指定した場合や、Triggerではないパラメーターを指定した場合は何も起こりません。
   * 
   * @param id パラメーターの名前
   */
  setTrigger(id: string): void;

  /**
   * @beta
   * このハンドルが操作対象とするコンポーネントが `Animator` である場合、その `Animator` のBoolのパラメーターを設定します。
   * それ以外のコンポーネントに対して呼び出した場合、例外になります。
   * 
   * 存在しないパラメーターを指定した場合や、Boolではないパラメーターを指定した場合は何も起こりません。
   * 
   * @param id パラメーターの名前
   * @param value パラメーターの値
   */
  setBool(id: string, value: boolean): void;

  /**
   * @beta
   * このハンドルが操作対象とするコンポーネントが `Animator` である場合、その `Animator` のIntegerのパラメーターを設定します。
   * それ以外のコンポーネントに対して呼び出した場合、例外になります。
   * 
   * 存在しないパラメーターを指定した場合や、Integerではないパラメーターを指定した場合は何も起こりません。
   * 
   * @param id パラメーターの名前
   * @param value パラメーターの値
   */
  setInteger(id: string, value: number): void;

  /**
   * @beta
   * このハンドルが操作対象とするコンポーネントが `Animator` である場合、その `Animator` のFloatのパラメーターを設定します。
   * それ以外のコンポーネントに対して呼び出した場合、例外になります。
   * 
   * 存在しないパラメータを指定した場合や、Floatではないパラメーターを指定した場合は何も起こりません。
   * 
   * @param id パラメーターの名前
   * @param value パラメーターの値
   */
  setFloat(id: string, value: number): void;

  /**
   * @beta
   * {@link PlayerLocalObject.getUnityComponent | PlayerLocalObject.getUnityComponent} で取得された `Button` コンポーネントに対してボタンの操作時に呼ばれるコールバック関数を登録します。
   * それ以外のコンポーネントに対して呼び出した場合、例外になります。
   * 
   * 複数回同じ `Button` コンポーネントに対してコールバックを登録すると最後の登録のみが有効になります。
   * 
   * コールバックはボタンを押し下げると `isDown = true` で呼び出され、その後にボタンを離すと `isDown = false` で呼び出されます。
   * このコールバックは `isDown = true` で呼ばれたあと、必ずしも `isDown = false` で呼ばれるとは限りません。
   * 例えば、ボタンを押したままポインターをボタンの外側にずらした後に手を離すと `isDown = false` でのコールバックは呼ばれません。
   * 
   * @param callback ボタンの操作時に呼ばれるcallback関数
   */
  onClick(callback: (isDown: boolean) => void): void;
}

/** @internal */
// type UnityComponentPropertyProxy = {
//   [propName: string]: UnityComponentPropertyValue;
// };

/** @internal */
type UnityComponentPropertyValue = boolean | number | string | Vector2 | Vector3 | Vector4 | Quaternion | Color;

/**
 * @item
 * 
 * ユーザーがイベント内でギフトを贈ったときの情報です。
 * {@link ClusterScript.onGiftSent | ClusterScript.onGiftSent} のコールバックの引数として取得できます。
 * 
 */
interface GiftInfo {

  /**
   * ギフトを1回贈るごとに生成されるIDです。単一のイベント内で一意に割り当てられます。
   * {@link senderDisplayName} や {@link timestamp} 等の値によらず、この値が異なる `GiftInfo` は別途贈ったギフトを指します。
   * 
   */
  readonly id: string;

  /**
   * ギフトを贈ったプレイヤーです。
   * ゴーストやグループビューイングでイベントに参加しているプレイヤーがギフトを贈った場合は `null` になります。
   * 
   * また、ギフトを贈ったプレイヤーが退室済みの場合は `sender.exists()` は `false` になることがあります。
   */
  readonly sender: PlayerHandle | null;

  /**
   * ギフトを贈ったプレイヤーの表示名です。
   * 
   * この値は {@link GiftInfo.sender} とは異なり、ゴーストやグループビューイングで参加したプレイヤーがギフトを贈った場合にも有効な表示名を返します。
   * 
   */
  readonly senderDisplayName: string;

  /**
   * ギフトの初期位置をグローバル座標で取得します。
   * 
   * ギフトの初期位置とは、ギフトを贈ったプレイヤーがギフトを投げた手元付近の位置を指します。
   * 
   * この位置に対してアイテムを生成するとき、ギフトが生成したアイテムに衝突してしまい、プレイヤーが意図しない位置でギフト演出が開始されることがあります。
   * `initialPosition` の位置に生成したアイテムにギフトが衝突することを避けるには、アイテムにColliderをアタッチしないようにするか、
   * または生成するアイテムのレイヤーを VenueLayer0, VenueLayer1, VenueLayer2 などに設定します。
   * ワールドで使用できるレイヤーの詳細は [レイヤー](https://docs.cluster.mu/creatorkit/world/unity-spec/layer/) を参照してください。
   * 
   */
  readonly initialPosition: Vector3;

  /**
   * ギフトの初期姿勢をグローバル座標で取得します。
   * 
   * ギフトの初期姿勢とは、ギフトを贈ったプレイヤーがギフトを投げた手元付近での姿勢を指します。
   */
  readonly initialRotation: Quaternion;

  /**
   * ギフトの初速をグローバル座標で取得します。
   * 
   * ギフトの初速とは、ギフトを贈ったプレイヤーが手元からギフトを投げたときの初速度を指します。
   * 
   * ギフトは {@link PlayerHandle.setGravity | PlayerHandle.setGravity} 等の影響を受けず、一定の下方向の加速度を受けながら放物運動を行います。
   */
  readonly initialVelocity: Vector3;

  /**
   * 贈られたギフトの価格を、クラスターコインの整数値として取得します。
   */
  readonly price: number;
 
  /**
   * ギフトが贈られた時刻(UTC)を、unix epochからの経過時刻でミリ秒単位の値として取得します。
   */
  readonly timestamp: number;  

  /**
   * ギフトの種類が識別できる文字列を取得します。形状が同じでも、色が異なるギフトでは異なる値を返します。
   * 
   * `giftType` の名称と実際のギフトとの対応関係については [ギフト一覧](https://docs.cluster.mu/creatorkit/appendix/gift-list) を参照してください。
   * 
   */
  readonly giftType: string;
}

/**
 * {@link ClusterScript.getLatestComments | ClusterScript.getLatestComments}および{@link ClusterScript.onCommentReceived | ClusterScript.onCommentReceived}で取得できるコメントです。
 */
interface Comment {

    /**
     * コメントごとに一意なIDです。
     */
    id: string,

    /**
     * コメントをしたプレイヤーのPlayerHandleです。
     *
     * 以下の場合にnullを返します。
     * - YouTubeからのコメントである場合
     * - ゴーストやグループビューイングからのコメントである場合
     */
    sender: PlayerHandle | null,

    /**
     * コメントをしたclusterのユーザーまたはYouTubeのユーザーの表示名です。
     */
    displayName: string,

    /**
     * コメントの本文の文字列です。
     */
    body: string,

    /**
     * コメントが行われた時刻です。
     * UNIXエポックからの経過ミリ秒の数字を返します。
     *
     * `via`が`"YouTube"`の場合、コメントのタイムスタンプは下3桁は常に000となり秒までの精度となります。
     */
    timestamp: number,

    /**
     * コメントがどこを通じて行われたかを示す文字列です。
     * 現時点では`"cluster"`または`"YouTube"`のいずれかの値を取ります。
     * 今後のアップデートで追加される可能性があります。
     */
    via: "cluster" | "YouTube",
}

/**
 * @player
 * 
 * Open Sound Control (OSC)メッセージ内で扱われる単一の値を表します。
 */
declare class OscValue {
  /** @internal */
  private constructor();

  /**
   * 値を整数として取得します。
   * この値が整数型として解釈できない場合は `null` を返します。
   */
  getInt(): number | null;

  /**
   * 値を浮動小数点数として取得します。
   * この値が浮動小数点数として解釈できない場合は `null` を返します。
   */
  getFloat(): number | null;

  /**
   * 値をASCII文字列として取得します。
   * この値がASCII文字列として解釈できない場合は `null` を返します。
   */
  getAsciiString(): string | null;

  /**
   * BLOB形式のデータをUTF-8文字列として取得します。
   * BLOBデータが存在しない場合や、UTF-8として解釈できない場合は `null` を返します。
   */
  getBlobAsUtf8String(): string | null;

  /**
   * BLOB形式のデータを `Uint8Array` として取得します。
   * BLOBデータが存在しない場合は `null` を返します。
   */
  getBlobAsUint8Array(): Uint8Array | null;

  /**
   * 値をブール値として取得します。
   * この値がブール値として解釈できない場合は `null` を返します。
   */
  getBool(): boolean | null;
}

/**
 * @player
 * 
 * 単一のOpen Sound Control (OSC)メッセージを表します。
 */
declare class OscMessage {
  /** @internal */
  private constructor();

  /**
   * このOSCメッセージのタイムスタンプを表します。
   * UNIXエポックを起点としたミリ秒単位の数値として返します。
   */
  readonly timestamp: number;

  /**
   * OSCメッセージのアドレスを表します。
   */
  readonly address: string;

  /**
   * メッセージに含まれる値の配列です。
   */
  readonly values: OscValue[];
}

/**
 * @player
 * 
 * Open Sound Control (OSC)の受信を行うためのハンドルです。
 * {@link PlayerScript.oscHandle | PlayerScript.oscHandle}で取得することができます。
 * 
 * OSCについては[OpenSoundControl Specification 1.0](https://opensoundcontrol.stanford.edu/spec-1_0.html)などを参照してください。
 */
interface OscHandle {
  /**
   * OSCメッセージを受信した際に呼び出されるコールバックを登録します。
   * `callback`には直前のフレームから現在のフレームまでの間で受信した{@link OscMessage}の配列が渡されます。
   * 複数回呼ばれた場合、最後の登録のみが有効です。
   * 
   * ただし、以下のいずれかの条件を満たす場合、コールバックは呼び出されません。
   * - {@link isReceiveEnabled} が `false` の場合
   * - ファイアウォールなどのネットワーク設定によってOSCメッセージを受信できない場合
   * - 受信したOSCメッセージのアドレスが `/cluster/` から始まる場合（システムで予約済み）
   * 
   * @example
   * ```ts
   * // 受信したOSCメッセージをログに出力する
   * _.oscHandle.onReceive(messages => {
   *   const lines = [];
   * 
   *   messages.forEach((message, i) => {
   *     const { address, timestamp, values } = message;
   * 
   *     lines.push(`== message [${i + 1}/${messages.length}]`);
   *     lines.push(`address: ${address}`);
   *     lines.push(`timestamp: ${new Date(timestamp).toLocaleString()}`);
   * 
   *     values.forEach((value, j) => {
   *       lines.push(`= value [${j + 1}/${values.length}]`);
   * 
   *       lines.push(`getInt(): ${value.getInt()}`);
   *       lines.push(`getFloat(): ${value.getFloat()}`);
   *       lines.push(`getAsciiString(): ${value.getAsciiString()}`);
   *       lines.push(`getBlobAsUint8Array(): ${value.getBlobAsUint8Array()}`);
   *       lines.push(`getBlobAsUtf8String(): ${value.getBlobAsUtf8String()}`);
   *       lines.push(`getBool(): ${value.getBool()}`);
   *     });
   *   });
   * 
   *   _.log(lines.join("\n"));
   * });
   * ```
   * 
   * @param callback
   * messages: 受信したOSCメッセージの配列です。
   */
  onReceive(callback: (messages: OscMessage[]) => void): void;

  /**
   * ユーザーがOSC入力を有効化しているかどうかを取得します。
   * 
   * 「設定」の「その他」タブの「OSC入力の有効化」から設定できます。
   */
  isReceiveEnabled(): boolean;
}

/**
 * @item
 *
 * {@link PlayerHandle.requestGrantProduct | PlayerHandle.requestGrantProduct} 及び {@link ClusterScript.onRequestGrantProductResult | ClusterScript.onRequestGrantProductResult} を使用して商品付与を実施した際の結果を示す、readonlyな型です。
 */
interface ProductGrantResult {
  /**
   * {@link PlayerHandle.requestGrantProduct | PlayerHandle.requestGrantProduct} で指定したmeta文字列です。
   */
  readonly meta: string;

  /**
   * 付与を実施した商品のIDです。
   */
  readonly productId: string;

  /**
   * 付与を実施した商品の商品名です。
   */
  readonly productName: string;

  /**
   * 付与されたプレイヤーの {@link PlayerHandle | PlayerHandle}です。
   */
  readonly player: PlayerHandle;

  /**
   * 商品付与の結果を示す文字列です。
   * - `"Unknown"` .. ネットワークエラーなどの理由で、付与が行われたかどうかが判定できないことを示します
   * - `"Granted"` .. プレイヤーに商品が付与されたことを示します
   * - `"AlreadyOwned"` .. プレイヤーがすでに商品を所持していたことを示します
   * - `"Failed"` ..  商品付与を実施しようとしたが、付与に失敗したことを示します
   */
  readonly status: ProductGrantStatus;

  /**
   * {@link ProductGrantResult.status | status} が `"Unknown"`、 `"Failed"` の場合に失敗理由を示す文字列です。{@link ProductGrantResult.status | status} がそれ以外の場合、 `null` を返します。
   */
  readonly errorReason: string;
}

/** @internal @item */
type ProductGrantStatus = "Unknown" | "Granted" | "AlreadyOwned" | "Failed";
