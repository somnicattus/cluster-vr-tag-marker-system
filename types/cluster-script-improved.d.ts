/** アイテムやプレイヤーのステート */
interface StateProxy {
  [propName: string]: Sendable;
}

/** アイテムグループのステート */
interface GroupStateProxy {
  [propName: string]: Sendable;
}

/** Unity コンポーネントのプロパティ */
interface UnityComponentPropertyProxy {
  [propName: string]: UnityComponentPropertyValue;
}

interface ClusterScript {
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
  getStateCompat<T extends CompatParamType = CompatParamType>(
    target: CompatGimmickTarget,
    key: string,
    parameterType: T,
  ):
    | {
        signal: Date;
        boolean: boolean;
        float: number;
        double: number;
        integer: number;
        vector2: Vector2;
        vector3: Vector3;
      }[T]
    | undefined;
}
