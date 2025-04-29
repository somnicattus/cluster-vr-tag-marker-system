type CompatState = Date | boolean | number | Vector2 | Vector3;

type CompatStateParameterType<T extends CompatState> =
  | (T extends Date ? 'signal' : never)
  | (T extends boolean ? 'boolean' : never)
  | (T extends number ? 'float' | 'double' | 'integer' : never)
  | (T extends Vector2 ? 'vector2' : never)
  | (T extends Vector3 ? 'vector3' : never);

type IsOptional<T, K extends keyof T> = Omit<T, K> extends T ? true : false;
type IsNullable<T, K extends keyof T> = null extends T[K] ? true : false;

/**
 * 不変な `$.getStateCompat` の戻り値を `$.state` にキャッシュする関数を生成します。
 *
 * 生成された関数は、 `$.getStateCompat` の引数のキーと同名のプロパティが `$.state` にすでに存在する場合、キャッシュされた値を返します。
 * そうでない場合、`$.getStateCompat` を呼び出して値を取得し、その値を `$.state` の同名のプロパティにキャッシュします。
 * このとき `$.getStateCompat` の戻り値が `undefined` の場合、 `$.state` の同名のプロパティは `null` に設定され、以降この関数をいび出しても `$.getStateCompat` を呼び出さずに `undefined` を返します。
 *
 * `$.state` の同名のプロパティは、`$.getStateCompat` の戻り値と同じ型で、かつオプショナルで `null` とのユニオン型として型付けされている必要があります。
 * @param target `$.getStateCompat` の第一引数
 * @param key `$.getStateCompat` の第二引数
 * @param parameterType `$.getStateCompat` の第三引数
 * @returns `$.getStateCompat` の戻り値
 * @example
 * ```ts
 * const getFoo = createCachedCompatState('this', 'foo', 'float');
 *
 * $.onUpdate(() => {
 *   const foo = getFoo();
 *   if (foo === undefined) {
 *      $.log('foo is undefined.');
 *      return;
 *   }
 *   $.log(`foo is ${foo.toFixed(2)}.`);
 * });
 *
 * // `$.state` の型は `.d.ts` ファイルで以下のように定義されている必要があります。
 *
 * interface StateProxy {
 *   foo?: number | null;
 * }
 * ```
 * @param target
 * @param key
 * @param parameterType
 * @returns
 */
export const createCachedCompatState =
  <
    K extends keyof StateProxy & string,
    T extends IsOptional<StateProxy, K> extends true
      ? IsNullable<StateProxy, K> extends true
        ? NonNullable<StateProxy[K]> extends CompatState
          ? CompatStateParameterType<NonNullable<StateProxy[K]>>
          : never
        : never
      : never,
  >(
    target: 'this' | 'owner' | 'global',
    key: K,
    parameterType: T,
  ) =>
  ():
    | {
        signal: Date;
        boolean: boolean;
        float: number;
        double: number;
        integer: number;
        vector2: Vector2;
        vector3: Vector3;
      }[T]
    | undefined => {
    const cache = $.state[key];
    // @ts-expect-error Type of state is guaranteed to be the same as the type of state by the type of parameterType
    if (cache !== undefined) return cache ?? undefined;

    const state = $.getStateCompat(target, key, parameterType);
    // @ts-expect-error Type of state is guaranteed to be the same as the type of state by the type of parameterType
    $.state[key] = state ?? null;

    return state;
  };
