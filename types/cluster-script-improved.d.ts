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
